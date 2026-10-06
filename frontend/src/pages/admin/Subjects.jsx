import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [form, setForm] = useState({
    code: "",
    name: "",
    semester: 1,
    faculty_id: "",
  });

  const loadData = async () => {
    try {
      const [subjectsRes, facultyRes] =
        await Promise.all([
          api.get("/admin/subjects"),
          api.get("/admin/faculty"),
        ]);

      setSubjects(subjectsRes.data);
      setFaculty(facultyRes.data);
    } catch (error) {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addSubject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/subjects", {
        ...form,
        semester: Number(form.semester),
        faculty_id: form.faculty_id
          ? Number(form.faculty_id)
          : null,
      });

      alert("Subject created");

      setForm({
        code: "",
        name: "",
        semester: 1,
        faculty_id: "",
      });

      loadData();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <h1>Subject Management</h1>

      <div className="admin-form-card">
        <h2>Add Subject</h2>

        <form
          onSubmit={addSubject}
          className="admin-form"
        >
          <input
            placeholder="Subject Code"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Subject Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            min="1"
            max="8"
            value={form.semester}
            onChange={(e) =>
              setForm({
                ...form,
                semester: e.target.value,
              })
            }
            required
          />

          <select
            value={form.faculty_id}
            onChange={(e) =>
              setForm({
                ...form,
                faculty_id: e.target.value,
              })
            }
          >
            <option value="">
              Select Faculty
            </option>

            {faculty.map((f) => (
              <option
                key={f.id}
                value={f.id}
              >
                {f.name} - {f.employee_id}
              </option>
            ))}
          </select>

          <button type="submit">
            Add Subject
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Subjects</h2>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Faculty</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.semester}</td>
                <td>
                  {subject.faculty_name || "Not Assigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}