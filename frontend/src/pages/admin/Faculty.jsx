import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employee_id: "",
    department: "",
    designation: "",
  });

  const loadFaculty = async () => {
    try {
      const response = await api.get("/admin/faculty");
      setFaculty(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Failed");
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addFaculty = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/faculty", form);

      alert("Faculty added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        employee_id: "",
        department: "",
        designation: "",
      });

      loadFaculty();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <h1>Faculty Management</h1>

      <div className="admin-form-card">
        <h2>Add Faculty</h2>

        <form
          onSubmit={addFaculty}
          className="admin-form"
        >
          <input
            name="name"
            placeholder="Faculty Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="employee_id"
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />

          <button type="submit">
            Add Faculty
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Faculty List</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.employee_id}</td>
                <td>{item.email}</td>
                <td>{item.department}</td>
                <td>{item.designation}</td>
                <td>
                  {item.is_active
                    ? "Active"
                    : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}