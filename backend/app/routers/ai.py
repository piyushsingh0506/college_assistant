import json
import os
import time
import urllib.error
import urllib.request

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import (
    Assignment,
    Attendance,
    Exam,
    Lab,
    Marks,
    Notice,
    Notification,
    Student,
    Subject,
    Timetable,
)

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"]
)


class AskRequest(BaseModel):
    question: str = Field(
        min_length=2,
        max_length=2000
    )


def student_context(db: Session, user) -> str:

    student = (
        db.query(Student)
        .filter(Student.user_id == user.id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    subjects = (
        db.query(Subject)
        .filter(Subject.semester == student.semester)
        .all()
    )

    subject_ids = [
        subject.id
        for subject in subjects
    ]

    subject_names = {
        subject.id: subject.name
        for subject in subjects
    }

    context = {
        "student": {
            "course": student.course,
            "semester": student.semester,
            "section": student.section,
        },

        "marks": [
            {
                "subject": subject_names.get(
                    row.subject_id,
                    "Unknown subject"
                ),
                "internal": row.internal,
                "external": row.external,
                "total": row.total,
                "grade": row.grade,
            }
            for row in (
                db.query(Marks)
                .filter(
                    Marks.student_id == student.id
                )
                .limit(30)
                .all()
            )
        ],

        "attendance": [
            {
                "subject": subject_names.get(
                    row.subject_id,
                    "Unknown subject"
                ),
                "present": row.present,
                "total_classes": row.total_classes,
                "percentage": (
                    round(
                        row.present / row.total_classes * 100,
                        2
                    )
                    if row.total_classes
                    else 0
                ),
            }
            for row in (
                db.query(Attendance)
                .filter(
                    Attendance.student_id == student.id
                )
                .limit(30)
                .all()
            )
        ],

        "timetable": [
            {
                "day": row.day,
                "subject": (
                    row.subject.name
                    if row.subject
                    else "Unknown subject"
                ),
                "start_time": (
                    row.start_time.strftime("%H:%M")
                    if row.start_time
                    else None
                ),
                "end_time": (
                    row.end_time.strftime("%H:%M")
                    if row.end_time
                    else None
                ),
                "room": row.room,
            }
            for row in (
                db.query(Timetable)
                .filter(
                    Timetable.semester == student.semester,
                    Timetable.section == student.section,
                )
                .limit(30)
                .all()
            )
        ],

        "assignments": [
            {
                "subject": (
                    row.subject.name
                    if row.subject
                    else "Unknown subject"
                ),
                "title": row.title,
                "description": row.description,
                "due_date": (
                    str(row.due_date)
                    if row.due_date
                    else None
                ),
            }
            for row in (
                db.query(Assignment)
                .filter(
                    Assignment.subject_id.in_(subject_ids)
                )
                .limit(30)
                .all()
            )
        ] if subject_ids else [],

        "exams": [
            {
                "subject": (
                    row.subject.name
                    if row.subject
                    else "Unknown subject"
                ),
                "type": row.exam_type,
                "date": str(row.exam_date),
                "time": (
                    row.start_time.strftime("%H:%M")
                    if row.start_time
                    else None
                ),
                "room": row.room,
            }
            for row in (
                db.query(Exam)
                .filter(
                    Exam.subject_id.in_(subject_ids)
                )
                .limit(30)
                .all()
            )
        ] if subject_ids else [],

        "notices": [
            {
                "title": row.title,
                "message": row.message,
            }
            for row in (
                db.query(Notice)
                .filter(
                    Notice.audience.in_(
                        ["all", "students"]
                    )
                )
                .order_by(Notice.id.desc())
                .limit(10)
                .all()
            )
        ],

        "notifications": [
            {
                "title": row.title,
                "message": row.message,
                "is_read": row.is_read,
            }
            for row in (
                db.query(Notification)
                .filter(
                    Notification.user_id == user.id
                )
                .order_by(Notification.id.desc())
                .limit(10)
                .all()
            )
        ],

        "labs": [
            {
                "name": row.name,
                "room": row.room,
                "description": row.description,
            }
            for row in (
                db.query(Lab)
                .limit(20)
                .all()
            )
        ],
    }

    return json.dumps(
        context,
        ensure_ascii=True,
        default=str
    )


@router.post("/ask")
def ask_ai(
    payload: AskRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role("student")),
):

    question = payload.question.strip()

    if not question:
        raise HTTPException(
            status_code=422,
            detail="Question cannot be blank"
        )

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail=(
                "Gemini AI is not configured. "
                "Set GEMINI_API_KEY in backend/.env."
            )
        )

    model = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )

    context = student_context(
        db,
        user
    )

    prompt = f"""
You are a helpful AI Assistant inside a College Assistant application.

You can answer both college-specific and general questions.

COLLEGE-SPECIFIC QUESTIONS:
Use the supplied student academic context for:
- marks
- attendance
- timetable
- exams
- assignments
- notices
- notifications
- labs
- course
- semester
- section
- personal academic information

For college-specific questions:
- Use the supplied college data.
- Never invent student information.
- Never guess missing academic information.
- If the requested information is not available, say:
"That information is not available in the college data."

GENERAL QUESTIONS:
You can answer questions unrelated to the college database, including:
- Python
- programming
- Java
- C++
- JavaScript
- FastAPI
- React
- SQL
- machine learning
- deep learning
- artificial intelligence
- generative AI
- mathematics
- science
- technology
- career guidance
- interview preparation
- coding problems
- general knowledge
- study concepts
- normal conversation

For general questions:
- Answer normally using your general knowledge.
- Do not require college database information.
- Do not say that general information is unavailable in college data.

IMPORTANT:
- Never invent personal student information.
- Do not confuse general knowledge with student-specific information.
- For college questions, prioritize the supplied student data.
- For general questions, answer normally.
- Keep answers clear and helpful.
- Explain difficult concepts simply.
- Provide examples when useful.
- If the user asks for code, provide correct and understandable code.

STUDENT ACADEMIC CONTEXT:
{context}

USER QUESTION:
{question}
"""

    endpoint = (
        "https://generativelanguage.googleapis.com/"
        f"v1beta/models/{model}:generateContent"
        f"?key={api_key}"
    )

    request_body = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3
        }
    }

    request = urllib.request.Request(
        endpoint,
        data=json.dumps(
            request_body
        ).encode("utf-8"),
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    MAX_RETRIES = 4
    result = None

    for attempt in range(MAX_RETRIES):

        try:

            print(
                f"Gemini request attempt "
                f"{attempt + 1}/{MAX_RETRIES}"
            )

            with urllib.request.urlopen(
                request,
                timeout=60
            ) as response:

                raw_response = (
                    response
                    .read()
                    .decode("utf-8")
                )

                print(
                    "Gemini HTTP Status:",
                    response.status
                )

                print(
                    "Gemini Response:",
                    raw_response
                )

                result = json.loads(
                    raw_response
                )

                break

        except urllib.error.HTTPError as exc:

            error_body = exc.read().decode(
                "utf-8",
                errors="replace"
            )

            print(
                "========== GEMINI ERROR =========="
            )

            print(
                "Attempt:",
                attempt + 1
            )

            print(
                "Status:",
                exc.code
            )

            print(
                "Response:",
                error_body
            )

            print(
                "==================================="
            )

            if exc.code in (
                408,
                429,
                500,
                502,
                503,
                504
            ):

                if attempt < MAX_RETRIES - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(
                        wait_time
                    )

                    continue

            raise HTTPException(
                status_code=502,
                detail=(
                    f"Gemini API error "
                    f"{exc.code}: "
                    f"{error_body}"
                )
            ) from None

        except urllib.error.URLError as exc:

            print(
                "Gemini connection error:",
                exc
            )

            if attempt < MAX_RETRIES - 1:

                wait_time = 2 ** attempt

                print(
                    f"Retrying connection "
                    f"in {wait_time} seconds..."
                )

                time.sleep(
                    wait_time
                )

                continue

            raise HTTPException(
                status_code=502,
                detail=(
                    "Could not connect "
                    "to Gemini API."
                )
            ) from None

        except TimeoutError:

            if attempt < MAX_RETRIES - 1:

                wait_time = 2 ** attempt

                print(
                    f"Gemini timeout. "
                    f"Retrying in {wait_time} seconds..."
                )

                time.sleep(
                    wait_time
                )

                continue

            raise HTTPException(
                status_code=504,
                detail=(
                    "Gemini API request "
                    "timed out."
                )
            ) from None

        except json.JSONDecodeError:

            raise HTTPException(
                status_code=502,
                detail=(
                    "Gemini returned "
                    "invalid JSON."
                )
            ) from None

    if not result:

        raise HTTPException(
            status_code=502,
            detail=(
                "Gemini did not return "
                "a valid response."
            )
        )

    candidates = result.get(
        "candidates",
        []
    )

    if not candidates:

        print(
            "Gemini returned no candidates:"
        )

        print(result)

        raise HTTPException(
            status_code=502,
            detail="Gemini returned no answer."
        )

    answer = (
        candidates[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )

    if (
        not isinstance(answer, str)
        or not answer.strip()
    ):

        print(
            "Gemini returned empty answer:"
        )

        print(result)

        raise HTTPException(
            status_code=502,
            detail="Gemini returned an empty answer."
        )

    return {
        "answer": answer.strip(),
        "model": model
    }