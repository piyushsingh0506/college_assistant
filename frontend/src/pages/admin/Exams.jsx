import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Exams() {
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [form, setForm] = useState({
    subject_id: "",
    exam_type: "Mid Semester",
    exam_date: "",
    start_time: "10:00",
    room: "",
  });

  const loadData = async () => {
    const [subjectsRes, examsRes] =
      await Promise.all([
        api.get("/admin/subjects"),
        api.get("/admin/exams"),
      ]);

    setSubjects(subjectsRes.data);
    setExams(examsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExam = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/exams", {
        ...form,
        subject_id: Number(form.subject_id),
      });

      alert("Exam schedule created");

      setForm({
        subject_id: "",
        exam_type: "Mid Semester",
        exam_date: "",
        start_time: "10:00",
        room: "",
      });

      loadData();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed"
      );
    }
  };

  const deleteExam = async (id) => {
    if (!confirm("Delete this exam?")) {
      return;
    }

    await api.delete(`/admin/exams/${id}`);

    loadData();
  };

  return (
    <div>
      <h1>Exam Management</h1>

      <div className="admin-form-card">
        <h2>Create Exam Schedule</h2>

        <form
          onSubmit={addExam}
          className="admin-form"
        >
          <select
            value={form.subject_id}
            onChange={(e) =>
              setForm({
                ...form,
                subject_id: e.target.value,
              })
            }
            required
          >
            <option value="">
              Select Subject
            </option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>

          <select
            value={form.exam_type}
            onChange={(e) =>
              setForm({
                ...form,
                exam_type: e.target.value,
              })
            }
          >
            <option>
              Mid Semester
            </option>

            <option>
              End Semester
            </option>

            <option>
              Practical
            </option>

            <option>
              Viva
            </option>
          </select>

          <label>
            Exam Date
          </label>

          <input
            type="date"
            value={form.exam_date}
            onChange={(e) =>
              setForm({
                ...form,
                exam_date: e.target.value,
              })
            }
            required
          />

          <label>
            Start Time
          </label>

          <input
            type="time"
            value={form.start_time}
            onChange={(e) =>
              setForm({
                ...form,
                start_time: e.target.value,
              })
            }
          />

          <input
            placeholder="Exam Room"
            value={form.room}
            onChange={(e) =>
              setForm({
                ...form,
                room: e.target.value,
              })
            }
          />

          <button type="submit">
            Create Exam
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Exam Schedule</h2>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Exam Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>
                  {exam.subject_code}
                  <br />
                  {exam.subject_name}
                </td>

                <td>
                  {exam.exam_type}
                </td>

                <td>
                  {exam.exam_date}
                </td>

                <td>
                  {exam.start_time || "-"}
                </td>

                <td>
                  {exam.room || "-"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      deleteExam(exam.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}