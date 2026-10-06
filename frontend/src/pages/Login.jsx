import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("student@college.com");
  const [password, setPassword] = useState("Student@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 async function submit(e) {
  e.preventDefault();
  setError("");

  try {
    const { data } = await api.post("/auth/login", {
      email,
      password
    });

    const user = data.user ?? { role: data.role, name: data.name };
    localStorage.setItem("college_token", data.access_token);
    localStorage.setItem("college_role", user.role);
    localStorage.setItem("college_name", user.name);
    localStorage.setItem("college_user", JSON.stringify(user));

    onLogin();

    navigate(`/${user.role}`);
  } catch (err) {
    console.error("Login error:", err.response?.data || err);

    setError(
      err.response?.data?.detail ||
      "Login failed"
    );
  }
}

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand">🎓 College Assistant</div>
        <h1>Welcome back</h1>
        <p>Login as Admin, Faculty or Student.</p>
        {error && <div className="error">{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <button className="primary">Login</button>
        <div className="demo-box">
          <b>Demo accounts</b><br />
          Admin: admin@college.com / Admin@123<br />
          Faculty: faculty@college.com / Faculty@123<br />
          Student: student@college.com / Student@123
        </div>
      </form>
    </div>
  );
}