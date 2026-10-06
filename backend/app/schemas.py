from datetime import date, time
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    enrollment_no: str
    course: str
    semester: int
    section: str
    phone: Optional[str] = None
    address: Optional[str] = None

class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    employee_id: str
    department: str
    designation: Optional[str] = None

class SubjectCreate(BaseModel):
    code: str
    name: str
    semester: int
    faculty_id: Optional[int] = None

class MarksCreate(BaseModel):
    student_id: int
    subject_id: int
    internal: float = 0
    external: float = 0

class AttendanceCreate(BaseModel):
    student_id: int
    subject_id: int
    present: int
    total_classes: int

class NoticeCreate(BaseModel):
    title: str
    message: str
    audience: str = "all"

class AssignmentCreate(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    file_url: Optional[str] = None

class ExamCreate(BaseModel):
    subject_id: int
    exam_type: str
    exam_date: date
    start_time: Optional[time] = None
    room: Optional[str] = None

class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    enrollment_no: str
    course: str
    semester: int
    section: str
    phone: Optional[str]
    address: Optional[str]

class FacultyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    employee_id: str
    department: str
    designation: Optional[str]
