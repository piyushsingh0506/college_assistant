import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    enrollment_no: "",
    course: "",
    semester: 1,
    section: "A",
    phone: "",
    address: "",
  });

  const loadStudents = async () => {
    try {
      const response = await api.get("/admin/students");
      setStudents(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addStudent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/students", {
        ...form,
        semester: Number(form.semester),
      });

      alert("Student added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        enrollment_no: "",
        course: "",
        semester: 1,
        section: "A",
        phone: "",
        address: "",
      });

      loadStudents();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <h1>Student Management</h1>

      <div className="admin-form-card">
        <h2>Add Student</h2>

        <form onSubmit={addStudent} className="admin-form">

          <input
            name="name"
            placeholder="Student Name"
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
            name="enrollment_no"
            placeholder="Enrollment Number"
            value={form.enrollment_no}
            onChange={handleChange}
            required
          />

          <input
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <input
            name="semester"
            type="number"
            min="1"
            max="8"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            required
          />

          <input
            name="section"
            placeholder="Section"
            value={form.section}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <button type="submit">
            Add Student
          </button>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>Students</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Enrollment</th>
              <th>Email</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.enrollment_no}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.semester}</td>
                <td>{student.section}</td>
                <td>
                  {student.is_active
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