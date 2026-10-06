from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Faculty, Subject, Marks, Attendance, Assignment, Exam, Student, Timetable, Notice
from ..schemas import MarksCreate, AttendanceCreate, AssignmentCreate, ExamCreate
from ..deps import require_role

router = APIRouter(prefix="/api/faculty", tags=["Faculty"])

def faculty_profile(user, db):
    faculty = db.query(Faculty).filter(Faculty.user_id == user.id).first()
    if not faculty:
        raise HTTPException(404, "Faculty profile not found")
    return faculty


def assigned_subject(db, faculty, subject_id):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.faculty_id == faculty.id
    ).first()
    if not subject:
        raise HTTPException(403, "You are not assigned to this subject")
    return subject

@router.get("/subjects")
def my_subjects(db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)
    return db.query(Subject).filter(Subject.faculty_id == faculty.id).all()

@router.get("/timetable")
def my_timetable(db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)

    subject_ids = [
        subject_id
        for (subject_id,) in db.query(Subject.id)
        .filter(Subject.faculty_id == faculty.id)
        .all()
    ]
    if not subject_ids:
        return []

    rows = (
        db.query(Timetable)
        .filter(Timetable.subject_id.in_(subject_ids))
        .order_by(Timetable.day, Timetable.start_time)
        .all()
    )
    return [
        {
            "id": row.id,
            "day": row.day,
            "subject": row.subject.name,
            "code": row.subject.code,
            "semester": row.semester,
            "section": row.section,
            "room": row.room,
            "start_time": row.start_time.strftime("%H:%M"),
            "end_time": row.end_time.strftime("%H:%M"),
        }
        for row in rows
    ]

@router.get("/notices")
def faculty_notices(db: Session = Depends(get_db), _=Depends(require_role("faculty"))):
    rows = (
        db.query(Notice)
        .filter(Notice.audience.in_(["all", "faculty"]))
        .order_by(Notice.id.desc())
        .limit(50)
        .all()
    )
    return [
        {"id": row.id, "title": row.title, "message": row.message, "audience": row.audience}
        for row in rows
    ]

@router.get("/students")
def students(db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)

    semesters = [
        semester
        for (semester,) in db.query(Subject.semester)
        .filter(Subject.faculty_id == faculty.id)
        .distinct()
        .all()
    ]
    if not semesters:
        return []

    return [{
        "id": s.id, "name": s.user.name, "enrollment_no": s.enrollment_no,
        "course": s.course, "semester": s.semester, "section": s.section
    } for s in db.query(Student).filter(Student.semester.in_(semesters)).all()]

@router.post("/upload/marks")
@router.post("/marks")
def save_marks(data: MarksCreate, db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)
    assigned_subject(db, faculty, data.subject_id)
    if not db.query(Student).filter(Student.id == data.student_id).first():
        raise HTTPException(404, "Student not found")
    total = data.internal + data.external
    grade = "A+" if total >= 90 else "A" if total >= 80 else "B" if total >= 70 else "C" if total >= 60 else "D" if total >= 50 else "F"
    row = db.query(Marks).filter(Marks.student_id == data.student_id, Marks.subject_id == data.subject_id).first()
    if not row:
        row = Marks(student_id=data.student_id, subject_id=data.subject_id)
        db.add(row)
    row.internal = data.internal; row.external = data.external; row.total = total; row.grade = grade
    db.commit()
    return {"message": "Marks saved", "total": total, "grade": grade}

@router.post("/upload/attendance")
@router.post("/attendance")
def save_attendance(data: AttendanceCreate, db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)
    assigned_subject(db, faculty, data.subject_id)
    row = db.query(Attendance).filter(Attendance.student_id == data.student_id, Attendance.subject_id == data.subject_id).first()
    if not row:
        row = Attendance(student_id=data.student_id, subject_id=data.subject_id)
        db.add(row)
    row.present = data.present; row.total_classes = data.total_classes
    db.commit()
    return {"message": "Attendance saved"}

@router.post("/assignments")
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)
    assigned_subject(db, faculty, data.subject_id)
    assignment = Assignment(**data.model_dump())
    db.add(assignment); db.commit(); db.refresh(assignment)
    return assignment

@router.post("/exams")
def create_exam(data: ExamCreate, db: Session = Depends(get_db), user=Depends(require_role("faculty"))):
    faculty = faculty_profile(user, db)
    assigned_subject(db, faculty, data.subject_id)
    exam = Exam(**data.model_dump())
    db.add(exam); db.commit(); db.refresh(exam)
    return exam
