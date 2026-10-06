import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Labs() {
  const [labs, setLabs] = useState([]);

  const [form, setForm] = useState({
    name: "",
    room: "",
    capacity: 30,
    description: "",
  });

  const loadLabs = async () => {
    const response = await api.get("/admin/labs");
    setLabs(response.data);
  };

  useEffect(() => {
    loadLabs();
  }, []);

  const addLab = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/labs", {
        ...form,
        capacity: Number(form.capacity),
      });

      alert("Lab added");

      setForm({
        name: "",
        room: "",
        capacity: 30,
        description: "",
      });

      loadLabs();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed"
      );
    }
  };

  const deleteLab = async (id) => {
    if (!confirm("Delete this lab?")) {
      return;
    }

    await api.delete(`/admin/labs/${id}`);

    loadLabs();
  };

  return (
    <div>
      <h1>Lab Management</h1>

      <div className="admin-form-card">
        <h2>Add Lab</h2>

        <form
          onSubmit={addLab}
          className="admin-form"
        >
          <input
            placeholder="Lab Name"
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
            placeholder="Room Number"
            value={form.room}
            onChange={(e) =>
              setForm({
                ...form,
                room: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) =>
              setForm({
                ...form,
                capacity: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button type="submit">
            Add Lab
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Labs</h2>

        <table>
          <thead>
            <tr>
              <th>Lab</th>
              <th>Room</th>
              <th>Capacity</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id}>
                <td>{lab.name}</td>
                <td>{lab.room}</td>
                <td>{lab.capacity}</td>
                <td>{lab.description}</td>

                <td>
                  <button
                    onClick={() =>
                      deleteLab(lab.id)
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