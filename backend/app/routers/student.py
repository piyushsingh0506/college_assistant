from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Marks, Attendance, Subject, Timetable, Assignment, Exam, Notice, Notification, LectureReplacement, Lab, Faculty
from ..deps import require_role

router = APIRouter(prefix="/api/student", tags=["Student"])

def profile(user, db):
    return db.query(Student).filter(Student.user_id == user.id).first()

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    return {"id": s.id, "name": user.name, "email": user.email, "enrollment_no": s.enrollment_no,
            "course": s.course, "semester": s.semester, "section": s.section, "phone": s.phone, "address": s.address}

@router.get("/id-card")
def id_card(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    return {"name": user.name, "enrollment_no": s.enrollment_no, "course": s.course,
            "semester": s.semester, "section": s.section, "email": user.email}

@router.get("/marks")
def marks(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    rows = db.query(Marks).filter(Marks.student_id == s.id).all()
    return [{"subject": db.get(Subject, r.subject_id).name, "code": db.get(Subject, r.subject_id).code,
             "internal": r.internal, "external": r.external, "total": r.total, "grade": r.grade} for r in rows]

@router.get("/attendance")
def attendance(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    rows = db.query(Attendance).filter(Attendance.student_id == s.id).all()
    result = []
    for r in rows:
        sub = db.get(Subject, r.subject_id)
        pct = round((r.present / r.total_classes) * 100, 2) if r.total_classes else 0
        result.append({"subject": sub.name, "code": sub.code, "present": r.present, "total": r.total_classes, "percentage": pct})
    return result

@router.get("/timetable")
def timetable(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    rows = db.query(Timetable).filter(Timetable.semester == s.semester, Timetable.section == s.section).all()
    return [{"day": r.day, "subject": r.subject.name, "code": r.subject.code, "room": r.room,
             "start_time": r.start_time.strftime("%H:%M"), "end_time": r.end_time.strftime("%H:%M")} for r in rows]

@router.get("/assignments")
def assignments(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    subjects = db.query(Subject).filter(Subject.semester == s.semester).all()
    ids = [x.id for x in subjects]
    rows = db.query(Assignment).filter(Assignment.subject_id.in_(ids)).all() if ids else []
    return [{"id": a.id, "subject": a.subject.name, "title": a.title, "description": a.description,
             "due_date": str(a.due_date) if a.due_date else None, "file_url": a.file_url} for a in rows]

@router.get("/exams")
def exams(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    subjects = db.query(Subject).filter(Subject.semester == s.semester).all()
    ids = [x.id for x in subjects]
    rows = db.query(Exam).filter(Exam.subject_id.in_(ids)).all() if ids else []
    return [{"subject": e.subject.name, "type": e.exam_type, "date": str(e.exam_date),
             "time": e.start_time.strftime("%H:%M") if e.start_time else None, "room": e.room} for e in rows]

@router.get("/notices")
def notices(db: Session = Depends(get_db), _=Depends(require_role("student"))):
    rows = (
        db.query(Notice)
        .filter(Notice.audience.in_(["all", "students"]))
        .order_by(Notice.id.desc())
        .all()
    )
    return [{"id": n.id, "title": n.title, "message": n.message, "audience": n.audience} for n in rows]

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    rows = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.id.desc()).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "is_read": n.is_read} for n in rows]

@router.get("/replacements")
def replacements(db: Session = Depends(get_db), user=Depends(require_role("student"))):
    s = profile(user, db)
    timetable = db.query(Timetable).filter(Timetable.semester == s.semester, Timetable.section == s.section).all()
    ids = [t.id for t in timetable]
    rows = db.query(LectureReplacement).filter(LectureReplacement.timetable_id.in_(ids)).all() if ids else []
    return [{"day": r.timetable.day, "subject": r.timetable.subject.name,
             "room": r.timetable.room, "replacement_teacher": r.replacement_faculty.user.name,
             "reason": r.reason} for r in rows]

@router.get("/labs")
def labs(db: Session = Depends(get_db), _=Depends(require_role("student"))):
    now = datetime.now()
    scheduled_classes = db.query(Timetable).filter(
        Timetable.start_time <= now.time(),
        Timetable.end_time > now.time()
    ).all()
    busy_rooms = {
        row.room.strip().casefold()
        for row in scheduled_classes
        if row.day.casefold() == now.strftime("%A").casefold() and row.room
    }

    return [
        {
            "id": lab.id,
            "name": lab.name,
            "room": lab.room,
            "capacity": lab.capacity,
            "description": lab.description,
            "available": not lab.room or lab.room.strip().casefold() not in busy_rooms,
            "status": "Available" if not lab.room or lab.room.strip().casefold() not in busy_rooms else "Busy",
        }
        for lab in db.query(Lab).all()
    ]
