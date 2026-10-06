import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Hash,
  Layers,
} from "lucide-react";

export default function DigitalID({
  profile,
}) {
  const student = profile || {};

  const name =
    student.name || "Student";

  return (
    <section className="role-panel student-id-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            STUDENT PROFILE
          </span>

          <h2>Digital ID</h2>
        </div>

        <GraduationCap size={21} />
      </div>

      <div className="role-welcome student-welcome">
        <div>
          <span className="role-eyebrow">
            COLLEGE ASSISTANT
          </span>

          <h2>{name}</h2>

          <p>
            {student.course ||
              "B.Tech Computer Science & Engineering"}
          </p>
        </div>

        <div className="faculty-mark">
          <GraduationCap size={30} />
        </div>
      </div>

      <div className="student-id-details">
        <strong>
          Student Information
        </strong>

        <span>
          <Hash size={13} />
          Enrollment Number:{" "}
          {student.enrollment_no ||
            student.enrollment_number ||
            "—"}
        </span>

        <span>
          <BookOpen size={13} />
          Roll Number:{" "}
          {student.roll_no ||
            student.roll_number ||
            "—"}
        </span>

        <span>
          <Layers size={13} />
          Semester:{" "}
          {student.semester || "—"}
        </span>

        <span>
          Section:{" "}
          {student.section || "—"}
        </span>

        <span>
          <Mail size={13} />
          Email:{" "}
          {student.email || "—"}
        </span>

        <span>
          <Phone size={13} />
          Phone:{" "}
          {student.phone ||
            student.mobile ||
            "—"}
        </span>
      </div>
    </section>
  );
}