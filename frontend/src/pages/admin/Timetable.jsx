import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Timetable() {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [form, setForm] = useState({
    semester: 1,
    section: "A",
    day: "Monday",
    subject_id: "",
    room: "",
    start_time: "09:00",
    end_time: "10:00",
  });

  const loadData = async () => {
    try {
      const [subjectsRes, timetableRes] =
        await Promise.all([
          api.get("/admin/subjects"),
          api.get("/admin/timetable"),
        ]);

      setSubjects(subjectsRes.data);
      setTimetable(timetableRes.data);
    } catch (error) {
      alert("Failed to load timetable");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTimetable = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/timetable", {
        ...form,
        semester: Number(form.semester),
        subject_id: Number(form.subject_id),
      });

      alert("Timetable created");

      loadData();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed");
    }
  };

  const deleteTimetable = async (id) => {
    if (!confirm("Delete this timetable entry?")) {
      return;
    }

    try {
      await api.delete(`/admin/timetable/${id}`);
      loadData();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <h1>Timetable Management</h1>

      <div className="admin-form-card">
        <h2>Create Timetable</h2>

        <form
          onSubmit={addTimetable}
          className="admin-form"
        >
          <input
            type="number"
            min="1"
            max="8"
            placeholder="Semester"
            value={form.semester}
            onChange={(e) =>
              setForm({
                ...form,
                semester: e.target.value,
              })
            }
          />

          <input
            placeholder="Section"
            value={form.section}
            onChange={(e) =>
              setForm({
                ...form,
                section: e.target.value,
              })
            }
          />

          <select
            value={form.day}
            onChange={(e) =>
              setForm({
                ...form,
                day: e.target.value,
              })
            }
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <option key={day}>
                {day}
              </option>
            ))}
          </select>

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

          <input
            placeholder="Room / Lab"
            value={form.room}
            onChange={(e) =>
              setForm({
                ...form,
                room: e.target.value,
              })
            }
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

          <label>
            End Time
          </label>

          <input
            type="time"
            value={form.end_time}
            onChange={(e) =>
              setForm({
                ...form,
                end_time: e.target.value,
              })
            }
          />

          <button type="submit">
            Save Timetable
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Timetable</h2>

        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Room</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {timetable.map((item) => (
              <tr key={item.id}>
                <td>{item.day}</td>

                <td>
                  {item.start_time} - {item.end_time}
                </td>

                <td>{item.semester}</td>

                <td>{item.section}</td>

                <td>
                  {item.subject_code}
                  <br />
                  {item.subject_name}
                </td>

                <td>
                  {item.faculty_name || "Not Assigned"}
                </td>

                <td>{item.room}</td>

                <td>
                  <button
                    onClick={() =>
                      deleteTimetable(item.id)
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