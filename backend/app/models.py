from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    Date,
    Time,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


# =========================================================
# USER
# =========================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(120), nullable=False)

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(String(255), nullable=False)

    role = Column(
        String(20),
        nullable=False,
        default="student"
    )

    is_active = Column(Boolean, default=True)

    student = relationship(
        "Student",
        back_populates="user",
        uselist=False
    )

    faculty = relationship(
        "Faculty",
        back_populates="user",
        uselist=False
    )


# =========================================================
# STUDENT
# =========================================================

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    enrollment_no = Column(
        String(50),
        unique=True,
        nullable=False
    )

    course = Column(
        String(100),
        nullable=False
    )

    semester = Column(
        Integer,
        nullable=False
    )

    section = Column(
        String(20),
        nullable=False
    )

    phone = Column(String(30))

    address = Column(String(255))

    user = relationship(
        "User",
        back_populates="student"
    )

    marks = relationship(
        "Marks",
        back_populates="student"
    )

    attendance = relationship(
        "Attendance",
        back_populates="student"
    )


# =========================================================
# FACULTY
# =========================================================

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    employee_id = Column(
        String(50),
        unique=True,
        nullable=False
    )

    department = Column(
        String(100),
        nullable=False
    )

    designation = Column(String(100))

    user = relationship(
        "User",
        back_populates="faculty"
    )

    subjects = relationship(
        "Subject",
        back_populates="faculty"
    )


# =========================================================
# SUBJECT
# =========================================================

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    code = Column(
        String(30),
        unique=True,
        nullable=False
    )

    name = Column(
        String(120),
        nullable=False
    )

    semester = Column(
        Integer,
        nullable=False
    )

    faculty_id = Column(
        Integer,
        ForeignKey("faculty.id")
    )

    faculty = relationship(
        "Faculty",
        back_populates="subjects"
    )

    marks = relationship(
        "Marks",
        back_populates="subject"
    )

    attendance = relationship(
        "Attendance",
        back_populates="subject"
    )

    timetable = relationship(
        "Timetable",
        back_populates="subject"
    )

    assignments = relationship(
        "Assignment",
        back_populates="subject"
    )

    exams = relationship(
        "Exam",
        back_populates="subject"
    )


# =========================================================
# MARKS
# =========================================================

class Marks(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    internal = Column(Float, default=0)

    external = Column(Float, default=0)

    total = Column(Float, default=0)

    grade = Column(String(5))

    student = relationship(
        "Student",
        back_populates="marks"
    )

    subject = relationship(
        "Subject",
        back_populates="marks"
    )

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "subject_id",
            name="uq_student_subject_marks"
        ),
    )


# =========================================================
# ATTENDANCE
# =========================================================

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    present = Column(Integer, default=0)

    total_classes = Column(Integer, default=0)

    student = relationship(
        "Student",
        back_populates="attendance"
    )

    subject = relationship(
        "Subject",
        back_populates="attendance"
    )

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "subject_id",
            name="uq_student_subject_attendance"
        ),
    )


# =========================================================
# TIMETABLE
# =========================================================

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(Integer, primary_key=True, index=True)

    semester = Column(
        Integer,
        nullable=False
    )

    section = Column(
        String(20),
        nullable=False
    )

    day = Column(
        String(20),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    room = Column(String(100))

    start_time = Column(
        Time,
        nullable=False
    )

    end_time = Column(
        Time,
        nullable=False
    )

    subject = relationship(
        "Subject",
        back_populates="timetable"
    )


# =========================================================
# ASSIGNMENT
# =========================================================

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(Text)

    due_date = Column(Date)

    file_url = Column(String(500))

    subject = relationship(
        "Subject",
        back_populates="assignments"
    )


# =========================================================
# EXAM
# =========================================================

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )

    exam_type = Column(
        String(50),
        nullable=False
    )

    exam_date = Column(
        Date,
        nullable=False
    )

    start_time = Column(Time)

    room = Column(String(100))

    subject = relationship(
        "Subject",
        back_populates="exams"
    )


# =========================================================
# NOTICE
# =========================================================

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String(200),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    audience = Column(
        String(30),
        default="all"
    )


# =========================================================
# NOTIFICATION
# =========================================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False
    )


# =========================================================
# LECTURE REPLACEMENT
# =========================================================

class LectureReplacement(Base):
    __tablename__ = "lecture_replacements"

    id = Column(Integer, primary_key=True, index=True)

    timetable_id = Column(
        Integer,
        ForeignKey("timetable.id"),
        nullable=False
    )

    replacement_faculty_id = Column(
        Integer,
        ForeignKey("faculty.id"),
        nullable=False
    )

    reason = Column(String(255))

    timetable = relationship(
        "Timetable"
    )

    replacement_faculty = relationship(
        "Faculty"
    )


# =========================================================
# LAB
# =========================================================

class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(120),
        nullable=False
    )

    room = Column(String(50))

    capacity = Column(
        Integer,
        default=30
    )

    description = Column(Text)