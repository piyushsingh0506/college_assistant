from datetime import date, time
from app.database import Base, engine, SessionLocal
from app.models import User, Student, Faculty, Subject, Marks, Attendance, Timetable, Assignment, Exam, Notice, Lab
from app.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def get_user(email):
    return db.query(User).filter(User.email == email).first()

try:
    admin = get_user("admin@college.com")
    if not admin:
        admin = User(name="College Admin", email="admin@college.com", password_hash=hash_password("Admin@123"), role="admin")
        db.add(admin); db.flush()

    faculty_user = get_user("faculty@college.com")
    if not faculty_user:
        faculty_user = User(name="Dr. Anjali Sharma", email="faculty@college.com", password_hash=hash_password("Faculty@123"), role="faculty")
        db.add(faculty_user); db.flush()
    faculty = db.query(Faculty).filter(Faculty.user_id == faculty_user.id).first()
    if not faculty:
        faculty = Faculty(user_id=faculty_user.id, employee_id="FAC001", department="CSE", designation="Assistant Professor")
        db.add(faculty); db.flush()

    student_user = get_user("student@college.com")
    if not student_user:
        student_user = User(name="Piyush Singh", email="student@college.com", password_hash=hash_password("Student@123"), role="student")
        db.add(student_user); db.flush()
    student = db.query(Student).filter(Student.user_id == student_user.id).first()
    if not student:
        student = Student(user_id=student_user.id, enrollment_no="CSE2026AI001", course="B.Tech CSE AI/ML",
                          semester=5, section="A", phone="9999999999", address="Indore")
        db.add(student); db.flush()

    subject = db.query(Subject).filter(Subject.code == "AIML501").first()
    if not subject:
        subject = Subject(code="AIML501", name="Machine Learning", semester=5, faculty_id=faculty.id)
        db.add(subject); db.flush()

    if not db.query(Marks).filter(Marks.student_id == student.id, Marks.subject_id == subject.id).first():
        db.add(Marks(student_id=student.id, subject_id=subject.id, internal=24, external=58, total=82, grade="A"))

    if not db.query(Attendance).filter(Attendance.student_id == student.id, Attendance.subject_id == subject.id).first():
        db.add(Attendance(student_id=student.id, subject_id=subject.id, present=38, total_classes=42))

    if not db.query(Timetable).filter(Timetable.semester == 5, Timetable.section == "A").first():
        db.add(Timetable(semester=5, section="A", day="Monday", subject_id=subject.id,
                         room="Lab 1", start_time=time(10,0), end_time=time(11,0)))

    if not db.query(Assignment).filter(Assignment.subject_id == subject.id).first():
        db.add(Assignment(subject_id=subject.id, title="ML Classification Assignment",
                           description="Build a classification model and submit the report.",
                           due_date=date(2026,10,10)))

    if not db.query(Exam).filter(Exam.subject_id == subject.id).first():
        db.add(Exam(subject_id=subject.id, exam_type="Mid Term", exam_date=date(2026,10,15),
                    start_time=time(10,0), room="Room 201"))

    if not db.query(Lab).first():
        db.add(Lab(name="AI/ML Lab", room="Lab 1", capacity=30, description="AI, ML and Deep Learning practical lab."))

    if not db.query(Notice).first():
        db.add(Notice(title="Welcome to College Assistant",
                      message="The new digital college assistant portal is now available.",
                      created_by=admin.id, audience="all"))

    db.commit()
    print("Seed completed successfully.")
    print("Admin:   admin@college.com / Admin@123")
    print("Faculty: faculty@college.com / Faculty@123")
    print("Student: student@college.com / Student@123")
finally:
    db.close()
