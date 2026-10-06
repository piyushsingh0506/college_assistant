from datetime import time

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    User,
    Student,
    Faculty,
    Subject,
    Timetable,
    Notice,
    Lab,
    Exam,
)

from ..security import hash_password
from ..deps import require_role


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# =========================================================
# SCHEMAS
# =========================================================

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    enrollment_no: str
    course: str
    semester: int
    section: str
    phone: str | None = None
    address: str | None = None


class StudentUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    enrollment_no: str | None = None
    course: str | None = None
    semester: int | None = None
    section: str | None = None
    phone: str | None = None
    address: str | None = None
    is_active: bool | None = None


class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    employee_id: str
    department: str
    designation: str | None = None


class FacultyUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    employee_id: str | None = None
    department: str | None = None
    designation: str | None = None
    is_active: bool | None = None


class SubjectCreate(BaseModel):
    code: str
    name: str
    semester: int
    faculty_id: int | None = None


class SubjectUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    semester: int | None = None
    faculty_id: int | None = None


class TimetableCreate(BaseModel):
    semester: int
    section: str
    day: str
    subject_id: int
    room: str | None = None
    start_time: time
    end_time: time


class NoticeCreate(BaseModel):
    title: str
    message: str
    audience: str = "all"


class LabCreate(BaseModel):
    name: str
    room: str | None = None
    capacity: int = 30
    description: str | None = None


class ExamCreate(BaseModel):
    subject_id: int
    exam_type: str
    exam_date: str
    start_time: time | None = None
    room: str | None = None


# =========================================================
# DASHBOARD
# =========================================================

@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return {
        "students": db.query(Student).count(),
        "faculty": db.query(Faculty).count(),
        "subjects": db.query(Subject).count(),
        "timetable": db.query(Timetable).count(),
        "notices": db.query(Notice).count(),
        "labs": db.query(Lab).count(),
        "exams": db.query(Exam).count(),
    }


# =========================================================
# STUDENTS
# =========================================================

@router.post("/students")
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    if db.query(User).filter(
        User.email == data.email
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    if db.query(Student).filter(
        Student.enrollment_no == data.enrollment_no
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Enrollment number already exists"
        )

    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="student",
        is_active=True
    )

    db.add(new_user)
    db.flush()

    student = Student(
        user_id=new_user.id,
        enrollment_no=data.enrollment_no,
        course=data.course,
        semester=data.semester,
        section=data.section,
        phone=data.phone,
        address=data.address
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return {
        "message": "Student created successfully",
        "id": student.id
    }


@router.get("/students")
def get_students(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    students = db.query(Student).all()

    return [
        {
            "id": s.id,
            "name": s.user.name,
            "email": s.user.email,
            "enrollment_no": s.enrollment_no,
            "course": s.course,
            "semester": s.semester,
            "section": s.section,
            "phone": s.phone,
            "address": s.address,
            "is_active": s.user.is_active
        }
        for s in students
    ]


@router.put("/students/{student_id}")
def update_student(
    student_id: int,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field in [
        "enrollment_no",
        "course",
        "semester",
        "section",
        "phone",
        "address"
    ]:
        if field in update_data:
            setattr(
                student,
                field,
                update_data[field]
            )

    if "name" in update_data:
        student.user.name = update_data["name"]

    if "email" in update_data:
        student.user.email = update_data["email"]

    if "is_active" in update_data:
        student.user.is_active = update_data["is_active"]

    db.commit()

    return {
        "message": "Student updated successfully"
    }


@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student.user.is_active = False

    db.commit()

    return {
        "message": "Student deactivated successfully"
    }


# =========================================================
# FACULTY
# =========================================================

@router.post("/faculty")
def create_faculty(
    data: FacultyCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    if db.query(User).filter(
        User.email == data.email
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    if db.query(Faculty).filter(
        Faculty.employee_id == data.employee_id
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists"
        )

    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="faculty",
        is_active=True
    )

    db.add(new_user)
    db.flush()

    faculty = Faculty(
        user_id=new_user.id,
        employee_id=data.employee_id,
        department=data.department,
        designation=data.designation
    )

    db.add(faculty)
    db.commit()
    db.refresh(faculty)

    return {
        "message": "Faculty created successfully",
        "id": faculty.id
    }


@router.get("/faculty")
def get_faculty(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    faculty = db.query(Faculty).all()

    return [
        {
            "id": f.id,
            "name": f.user.name,
            "email": f.user.email,
            "employee_id": f.employee_id,
            "department": f.department,
            "designation": f.designation,
            "is_active": f.user.is_active
        }
        for f in faculty
    ]


@router.put("/faculty/{faculty_id}")
def update_faculty(
    faculty_id: int,
    data: FacultyUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    faculty = db.query(Faculty).filter(
        Faculty.id == faculty_id
    ).first()

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field in [
        "employee_id",
        "department",
        "designation"
    ]:
        if field in update_data:
            setattr(
                faculty,
                field,
                update_data[field]
            )

    if "name" in update_data:
        faculty.user.name = update_data["name"]

    if "email" in update_data:
        faculty.user.email = update_data["email"]

    if "is_active" in update_data:
        faculty.user.is_active = update_data["is_active"]

    db.commit()

    return {
        "message": "Faculty updated successfully"
    }


@router.delete("/faculty/{faculty_id}")
def delete_faculty(
    faculty_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    faculty = db.query(Faculty).filter(
        Faculty.id == faculty_id
    ).first()

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    faculty.user.is_active = False

    db.commit()

    return {
        "message": "Faculty deactivated successfully"
    }


# =========================================================
# SUBJECTS
# =========================================================

@router.post("/subjects")
def create_subject(
    data: SubjectCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    if db.query(Subject).filter(
        Subject.code == data.code
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Subject code already exists"
        )

    if data.faculty_id:

        faculty = db.query(Faculty).filter(
            Faculty.id == data.faculty_id
        ).first()

        if not faculty:
            raise HTTPException(
                status_code=404,
                detail="Faculty not found"
            )

    subject = Subject(
        code=data.code,
        name=data.name,
        semester=data.semester,
        faculty_id=data.faculty_id
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return {
        "message": "Subject created successfully",
        "id": subject.id
    }


@router.get("/subjects")
def get_subjects(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    subjects = db.query(Subject).all()

    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "semester": s.semester,
            "faculty_id": s.faculty_id,
            "faculty_name": (
                s.faculty.user.name
                if s.faculty
                else None
            )
        }
        for s in subjects
    ]


@router.put("/subjects/{subject_id}")
def update_subject(
    subject_id: int,
    data: SubjectUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    subject = db.query(Subject).filter(
        Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if "faculty_id" in update_data:
        if update_data["faculty_id"]:

            faculty = db.query(Faculty).filter(
                Faculty.id == update_data["faculty_id"]
            ).first()

            if not faculty:
                raise HTTPException(
                    status_code=404,
                    detail="Faculty not found"
                )

    for key, value in update_data.items():
        setattr(subject, key, value)

    db.commit()

    return {
        "message": "Subject updated successfully"
    }


@router.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    subject = db.query(Subject).filter(
        Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    db.delete(subject)
    db.commit()

    return {
        "message": "Subject deleted successfully"
    }


# =========================================================
# TIMETABLE
# =========================================================

@router.post("/timetable")
def create_timetable(
    data: TimetableCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    subject = db.query(Subject).filter(
        Subject.id == data.subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    if data.start_time >= data.end_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

    timetable = Timetable(
        semester=data.semester,
        section=data.section,
        day=data.day,
        subject_id=data.subject_id,
        room=data.room,
        start_time=data.start_time,
        end_time=data.end_time
    )

    db.add(timetable)
    db.commit()
    db.refresh(timetable)

    return {
        "message": "Timetable created successfully",
        "id": timetable.id
    }


@router.get("/timetable")
def get_timetable(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    timetable = db.query(Timetable).all()

    return [
        {
            "id": item.id,
            "semester": item.semester,
            "section": item.section,
            "day": item.day,
            "subject_id": item.subject_id,
            "subject_code": item.subject.code,
            "subject_name": item.subject.name,
            "faculty_name": (
                item.subject.faculty.user.name
                if item.subject.faculty
                else None
            ),
            "room": item.room,
            "start_time": item.start_time.strftime("%H:%M"),
            "end_time": item.end_time.strftime("%H:%M")
        }
        for item in timetable
    ]


@router.delete("/timetable/{timetable_id}")
def delete_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    item = db.query(Timetable).filter(
        Timetable.id == timetable_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Timetable entry not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Timetable deleted successfully"
    }


# =========================================================
# NOTICES
# =========================================================

@router.post("/notices")
def create_notice(
    data: NoticeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    notice = Notice(
        title=data.title,
        message=data.message,
        audience=data.audience,
        created_by=user.id
    )

    db.add(notice)
    db.commit()
    db.refresh(notice)

    return {
        "message": "Notice published successfully",
        "id": notice.id
    }


@router.get("/notices")
def get_notices(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    notices = db.query(Notice).order_by(
        Notice.id.desc()
    ).all()

    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "audience": n.audience,
            "created_by": n.created_by
        }
        for n in notices
    ]


@router.delete("/notices/{notice_id}")
def delete_notice(
    notice_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    notice = db.query(Notice).filter(
        Notice.id == notice_id
    ).first()

    if not notice:
        raise HTTPException(
            status_code=404,
            detail="Notice not found"
        )

    db.delete(notice)
    db.commit()

    return {
        "message": "Notice deleted successfully"
    }


# =========================================================
# LABS
# =========================================================

@router.post("/labs")
def create_lab(
    data: LabCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    lab = Lab(
        name=data.name,
        room=data.room,
        capacity=data.capacity,
        description=data.description
    )

    db.add(lab)
    db.commit()
    db.refresh(lab)

    return {
        "message": "Lab created successfully",
        "id": lab.id
    }


@router.get("/labs")
def get_labs(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    labs = db.query(Lab).all()

    return [
        {
            "id": lab.id,
            "name": lab.name,
            "room": lab.room,
            "capacity": lab.capacity,
            "description": lab.description
        }
        for lab in labs
    ]


@router.delete("/labs/{lab_id}")
def delete_lab(
    lab_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    lab = db.query(Lab).filter(
        Lab.id == lab_id
    ).first()

    if not lab:
        raise HTTPException(
            status_code=404,
            detail="Lab not found"
        )

    db.delete(lab)
    db.commit()

    return {
        "message": "Lab deleted successfully"
    }


# =========================================================
# EXAMS
# =========================================================

@router.post("/exams")
def create_exam(
    data: ExamCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    subject = db.query(Subject).filter(
        Subject.id == data.subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    from datetime import datetime

    try:
        exam_date = datetime.strptime(
            data.exam_date,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Date must be YYYY-MM-DD"
        )

    exam = Exam(
        subject_id=data.subject_id,
        exam_type=data.exam_type,
        exam_date=exam_date,
        start_time=data.start_time,
        room=data.room
    )

    db.add(exam)
    db.commit()
    db.refresh(exam)

    return {
        "message": "Exam created successfully",
        "id": exam.id
    }


@router.get("/exams")
def get_exams(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    exams = db.query(Exam).order_by(
        Exam.exam_date
    ).all()

    return [
        {
            "id": exam.id,
            "subject_id": exam.subject_id,
            "subject_code": exam.subject.code,
            "subject_name": exam.subject.name,
            "exam_type": exam.exam_type,
            "exam_date": exam.exam_date.isoformat(),
            "start_time": (
                exam.start_time.strftime("%H:%M")
                if exam.start_time
                else None
            ),
            "room": exam.room
        }
        for exam in exams
    ]


@router.delete("/exams/{exam_id}")
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    exam = db.query(Exam).filter(
        Exam.id == exam_id
    ).first()

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    db.delete(exam)
    db.commit()

    return {
        "message": "Exam deleted successfully"
    }