import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../services/auth";

export default function Layout({ children }) {

  const navigate = useNavigate();

  const role =
    localStorage.getItem("college_role");

  const name =
    localStorage.getItem("college_name");

  const logout = () => {
    clearAuthSession();
    navigate("/login");
  };


  return (
    <div className="app-layout">

      <aside className="sidebar">

        <h2>
           College Assistant
        </h2>


        <div className="user-info">
          <strong>{name}</strong>

          <span>
            {role?.toUpperCase()}
          </span>
        </div>


        <nav>

          {/* ADMIN */}

          {role === "admin" && (
            <>
              <Link to="/admin">
                📊 Dashboard
              </Link>

              <Link to="/admin/students">
                👨‍🎓 Students
              </Link>

              <Link to="/admin/faculty">
                👨‍🏫 Faculty
              </Link>

              <Link to="/admin/subjects">
                📚 Subjects
              </Link>

              <Link to="/admin/timetable">
                🕐 Timetable
              </Link>

              <Link to="/admin/notices">
                📢 Notices
              </Link>

              <Link to="/admin/labs">
                🧪 Labs
              </Link>

              <Link to="/admin/exams">
                📝 Exams
              </Link>
            </>
          )}


          {/* FACULTY */}

          {role === "faculty" && (
            <>
              <Link to="/faculty">
                📊 Dashboard
              </Link>
            </>
          )}


          {/* STUDENT */}

          {role === "student" && (
            <>
              <Link to="/student">
                📊 Dashboard
              </Link>
            </>
          )}

        </nav>


        <button
          className="logout-button"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>


      <main className="main-content">

        <header className="topbar">

          <h3>
            College Assistant
          </h3>

          <span>
            {role?.toUpperCase()}
          </span>

        </header>


        <section className="page-content">

          {children}

        </section>

      </main>

    </div>
  );
}