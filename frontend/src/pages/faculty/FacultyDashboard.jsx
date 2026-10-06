import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { clearAuthSession } from "../../services/auth";
import "../role-dashboards.css";

const actionModes = [
  ["marks", "Record marks", ClipboardList],
  ["attendance", "Attendance", CheckCircle2],
  ["assignment", "Assignment", BookOpen],
  ["exam", "Exam", CalendarDays],
];

const initialForm = {
  studentId: "",
  internal: "",
  external: "",
  present: "",
  totalClasses: "",
  title: "",
  description: "",
  dueDate: "",
  examType: "Mid Term",
  examDate: "",
  startTime: "",
  room: "",
};

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState("marks");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      const results = await Promise.allSettled([
        api.get("/faculty/subjects"),
        api.get("/faculty/students"),
        api.get("/faculty/timetable"),
        api.get("/faculty/notices"),
      ]);
      if (!active) return;

      if (results[0].status === "fulfilled") {
        const rows = results[0].value.data;
        setSubjects(rows);
        if (rows.length) setSubjectId(String(rows[0].id));
      }
      if (results[1].status === "fulfilled") {
        setStudents(results[1].value.data);
      }
      if (results[2].status === "fulfilled") {
        setTimetable(results[2].value.data);
      }
      if (results[3].status === "fulfilled") {
        setNotices(results[3].value.data);
      }
      const failed = results.some((result) => result.status === "rejected");
      setLoadError(failed ? "Some faculty data could not be loaded. Refresh to try again." : "");
      setLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const selectedSubject = subjects.find((subject) => String(subject.id) === subjectId);
  const subjectStudents = selectedSubject
    ? students.filter((student) => student.semester === selectedSubject.semester)
    : [];
  const facultyName = localStorage.getItem("college_name") || "Faculty";

  function logout() {
    clearAuthSession();
    navigate("/login");
  }

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitAction(event) {
    event.preventDefault();
    setFeedback(null);
    const numericSubjectId = Number(subjectId);
    let endpoint;
    let payload;

    if (!selectedSubject) {
      setFeedback({ type: "error", text: "Choose an assigned subject first." });
      return;
    }

    if (mode === "marks" || mode === "attendance") {
      if (!form.studentId) {
        setFeedback({ type: "error", text: "Choose a student from this subject's semester." });
        return;
      }
      if (mode === "marks") {
        endpoint = "/faculty/upload/marks";
        payload = {
          subject_id: numericSubjectId,
          student_id: Number(form.studentId),
          internal: Number(form.internal),
          external: Number(form.external),
        };
      } else {
        const present = Number(form.present);
        const totalClasses = Number(form.totalClasses);
        if (present > totalClasses) {
          setFeedback({ type: "error", text: "Classes attended cannot exceed total classes." });
          return;
        }
        endpoint = "/faculty/upload/attendance";
        payload = {
          subject_id: numericSubjectId,
          student_id: Number(form.studentId),
          present,
          total_classes: totalClasses,
        };
      }
    } else if (mode === "assignment") {
      endpoint = "/faculty/assignments";
      payload = {
        subject_id: numericSubjectId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.dueDate || null,
      };
    } else {
      endpoint = "/faculty/exams";
      payload = {
        subject_id: numericSubjectId,
        exam_type: form.examType.trim(),
        exam_date: form.examDate,
        start_time: form.startTime || null,
        room: form.room.trim() || null,
      };
    }

    try {
      await api.post(endpoint, payload);
      const labels = { marks: "Marks saved", attendance: "Attendance saved", assignment: "Assignment published", exam: "Exam scheduled" };
      setFeedback({ type: "success", text: `${labels[mode]} for ${selectedSubject.name}.` });
      setForm((current) => ({ ...initialForm, studentId: current.studentId }));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.detail || "Could not save this update. Try again.",
      });
    }
  }

  const requiresStudent = mode === "marks" || mode === "attendance";

  return (
    <div className="role-dashboard">
      <aside className="role-sidebar">
        <div className="role-brand">
          <span className="role-brand-mark"><GraduationCap size={21} /></span>
          <span><strong>College</strong><small>Assistant</small></span>
        </div>
        <div className="role-user">
          <span className="role-avatar">{facultyName.charAt(0).toUpperCase()}</span>
          <span><strong>{facultyName}</strong><small>Faculty portal</small></span>
        </div>
        <nav className="role-nav" aria-label="Faculty dashboard">
          <a className="role-nav-link is-current" href="#faculty-overview"><LayoutDashboard size={17} />Overview</a>
          <a className="role-nav-link" href="#faculty-roster"><Users size={17} />Class roster</a>
          <a className="role-nav-link" href="#faculty-timetable"><CalendarDays size={17} />Timetable</a>
          <a className="role-nav-link" href="#faculty-notices"><Bell size={17} />Notices</a>
          <a className="role-nav-link" href="#faculty-actions"><Plus size={17} />Teaching tools</a>
        </nav>
        <button className="role-logout" onClick={logout}><LogOut size={17} />Sign out</button>
      </aside>

      <main className="role-main">
        <header className="role-topbar">
          <div><span className="role-eyebrow">FACULTY PORTAL</span><h1>Teaching dashboard</h1></div>
          <span className="role-date">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
        </header>

        <div className="role-content">
          {loadError && <div className="role-alert" role="status">{loadError}</div>}
          <section id="faculty-overview" className="role-welcome faculty-welcome">
            <div><span className="role-eyebrow">YOUR TEACHING OVERVIEW</span><h2>Welcome, {facultyName}.</h2><p>Manage your classes and keep student records up to date.</p></div>
            <span className="faculty-mark"><GraduationCap size={34} /></span>
          </section>

          <section className="role-metrics" aria-label="Teaching summary">
            <article className="role-metric"><span className="metric-icon metric-green"><BookOpen size={19} /></span><div><small>Assigned subjects</small><strong>{loading ? "..." : subjects.length}</strong><span>Across your teaching load</span></div></article>
            <article className="role-metric"><span className="metric-icon metric-blue"><Users size={19} /></span><div><small>Students in your semesters</small><strong>{loading ? "..." : students.length}</strong><span>Relevant class roster</span></div></article>
            <article className="role-metric"><span className="metric-icon metric-amber"><CalendarDays size={19} /></span><div><small>Selected semester</small><strong>{selectedSubject?.semester ?? "—"}</strong><span>{selectedSubject?.name || "Choose a subject below"}</span></div></article>
          </section>

          <div className="role-columns">
            <section id="faculty-timetable" className="role-panel">
              <div className="role-panel-heading"><div><span className="role-eyebrow">YOUR TEACHING WEEK</span><h2>Timetable</h2></div><CalendarDays size={19} /></div>
              {timetable.length ? <div className="role-list">{timetable.map((item) => (
                <article className="role-list-item" key={item.id}>
                  <span className="role-list-date">{item.day.slice(0, 3)}</span>
                  <span className="role-list-copy"><strong>{item.subject}</strong><small>{item.code} · Semester {item.semester}, Section {item.section} · {item.start_time}–{item.end_time}</small></span>
                  <span className="role-list-meta"><MapPin size={14} />{item.room || "Room TBA"}</span>
                </article>
              ))}</div> : <p className="role-empty">{loading ? "Loading timetable…" : "No classes are scheduled for your subjects."}</p>}
            </section>

            <section id="faculty-notices" className="role-panel">
              <div className="role-panel-heading"><div><span className="role-eyebrow">CAMPUS UPDATES</span><h2>Notices</h2></div><Bell size={19} /></div>
              {notices.length ? <div className="role-list">{notices.map((notice) => (
                <article className="role-list-item notice-item" key={notice.id}>
                  <span className="notice-dot" />
                  <span className="role-list-copy"><strong>{notice.title}</strong><small>{notice.message}</small></span>
                </article>
              ))}</div> : <p className="role-empty">{loading ? "Loading notices…" : "No current notices."}</p>}
            </section>
          </div>

          <div className="role-columns role-faculty-columns">
            <section id="faculty-roster" className="role-panel">
              <div className="role-panel-heading"><div><span className="role-eyebrow">YOUR CLASSES</span><h2>Class roster</h2></div><Users size={19} /></div>
              <label className="role-field role-subject-filter"><span>Assigned subject</span><select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} disabled={!subjects.length}><option value="">{loading ? "Loading subjects…" : "No assigned subjects"}</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.code} · {subject.name} · Semester {subject.semester}</option>)}</select></label>
              {subjectStudents.length ? <div className="role-table-wrap"><table className="role-table"><thead><tr><th>Student</th><th>Enrollment</th><th>Course</th><th>Section</th></tr></thead><tbody>{subjectStudents.map((student) => <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.enrollment_no}</td><td>{student.course}</td><td>{student.section}</td></tr>)}</tbody></table></div> : <p className="role-empty">{loading ? "Loading class roster…" : selectedSubject ? "No students are registered in this subject's semester." : "No roster to show until a subject is assigned."}</p>}
            </section>

            <section id="faculty-actions" className="role-panel">
              <div className="role-panel-heading"><div><span className="role-eyebrow">CLASS MANAGEMENT</span><h2>Teaching tools</h2></div><ClipboardList size={19} /></div>
              <div className="role-segmented" role="tablist" aria-label="Teaching action">
                {actionModes.map(([value, label, Icon]) => <button type="button" role="tab" aria-selected={mode === value} className={mode === value ? "is-selected" : ""} key={value} onClick={() => { setMode(value); setFeedback(null); }}><Icon size={15} /><span>{label}</span></button>)}
              </div>
              <form className="role-action-form" onSubmit={submitAction}>
                {requiresStudent && <label className="role-field"><span>Student</span><select name="studentId" value={form.studentId} onChange={updateForm} required disabled={!subjectStudents.length}><option value="">{subjectStudents.length ? "Select student" : "No students in this semester"}</option>{subjectStudents.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.enrollment_no}</option>)}</select></label>}
                {mode === "marks" && <div className="role-form-row"><label className="role-field"><span>Internal marks</span><input name="internal" type="number" min="0" max="100" step="0.5" value={form.internal} onChange={updateForm} required /></label><label className="role-field"><span>External marks</span><input name="external" type="number" min="0" max="100" step="0.5" value={form.external} onChange={updateForm} required /></label></div>}
                {mode === "attendance" && <div className="role-form-row"><label className="role-field"><span>Classes attended</span><input name="present" type="number" min="0" value={form.present} onChange={updateForm} required /></label><label className="role-field"><span>Total classes</span><input name="totalClasses" type="number" min="1" value={form.totalClasses} onChange={updateForm} required /></label></div>}
                {mode === "assignment" && <><label className="role-field"><span>Assignment title</span><input name="title" value={form.title} onChange={updateForm} maxLength="120" required /></label><label className="role-field"><span>Description</span><textarea name="description" value={form.description} onChange={updateForm} rows="3" /></label><label className="role-field"><span>Due date</span><input name="dueDate" type="date" value={form.dueDate} onChange={updateForm} /></label></>}
                {mode === "exam" && <><label className="role-field"><span>Exam type</span><input name="examType" value={form.examType} onChange={updateForm} required /></label><label className="role-field"><span>Exam date</span><input name="examDate" type="date" value={form.examDate} onChange={updateForm} required /></label><div className="role-form-row"><label className="role-field"><span>Start time</span><input name="startTime" type="time" value={form.startTime} onChange={updateForm} /></label><label className="role-field"><span>Room</span><input name="room" value={form.room} onChange={updateForm} /></label></div></>}
                {feedback && <p className={feedback.type === "success" ? "role-feedback is-success" : "role-feedback is-error"} role="status">{feedback.text}</p>}
                <button className="role-submit" type="submit" disabled={loading || !subjects.length || (requiresStudent && !subjectStudents.length)}><Plus size={17} />{mode === "marks" ? "Save marks" : mode === "attendance" ? "Save attendance" : mode === "assignment" ? "Publish assignment" : "Schedule exam"}</button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}