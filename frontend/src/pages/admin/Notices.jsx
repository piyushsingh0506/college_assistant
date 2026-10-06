import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Notices() {
  const [notices, setNotices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const loadNotices = async () => {
    const response = await api.get("/admin/notices");
    setNotices(response.data);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const publishNotice = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/notices", form);

      alert("Notice published");

      setForm({
        title: "",
        message: "",
        audience: "all",
      });

      loadNotices();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to publish notice"
      );
    }
  };

  const deleteNotice = async (id) => {
    if (!confirm("Delete this notice?")) {
      return;
    }

    await api.delete(`/admin/notices/${id}`);

    loadNotices();
  };

  return (
    <div>
      <h1>Notice Management</h1>

      <div className="admin-form-card">
        <h2>Publish Notice</h2>

        <form
          onSubmit={publishNotice}
          className="admin-form"
        >
          <input
            placeholder="Notice Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Notice Message"
            rows="5"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            required
          />

          <select
            value={form.audience}
            onChange={(e) =>
              setForm({
                ...form,
                audience: e.target.value,
              })
            }
          >
            <option value="all">
              Everyone
            </option>

            <option value="students">
              Students
            </option>

            <option value="faculty">
              Faculty
            </option>
          </select>

          <button type="submit">
            Publish Notice
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Published Notices</h2>

        {notices.map((notice) => (
          <div
            className="notice-card"
            key={notice.id}
          >
            <h3>{notice.title}</h3>

            <p>{notice.message}</p>

            <small>
              Audience: {notice.audience}
            </small>

            <br />

            <button
              onClick={() =>
                deleteNotice(notice.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}