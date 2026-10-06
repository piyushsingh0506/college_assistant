import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSectionLayout from "./pages/admin/AdminSectionLayout";
import Exams from "./pages/admin/Exams";
import Faculty from "./pages/admin/Faculty";
import Labs from "./pages/admin/Labs";
import Notices from "./pages/admin/Notices";
import Students from "./pages/admin/Student";
import Subjects from "./pages/admin/Subjects";
import Timetable from "./pages/admin/Timetable";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

const adminPages = [
  ["/admin/students", Students],
  ["/admin/faculty", Faculty],
  ["/admin/subjects", Subjects],
  ["/admin/timetable", Timetable],
  ["/admin/notices", Notices],
  ["/admin/labs", Labs],
  ["/admin/exams", Exams],
];

function Protected({ children, role }) {
  const token = localStorage.getItem("college_token");
  const currentRole = localStorage.getItem("college_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("college_token")
  );

  useEffect(() => {
    const onStorage = () => {
      setLoggedIn(!!localStorage.getItem("college_token"));
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={() => setLoggedIn(true)} />}
      />
      <Route
        path="/admin"
        element={
          <Protected role="admin">
            <AdminDashboard />
          </Protected>
        }
      />
      {adminPages.map(([path, Page]) => (
        <Route
          key={path}
          path={path}
          element={
            <Protected role="admin">
              <AdminSectionLayout>
                <Page />
              </AdminSectionLayout>
            </Protected>
          }
        />
      ))}
      <Route
        path="/student"
        element={
          <Protected role="student">
            <StudentDashboard />
          </Protected>
        }
      />
      <Route
        path="/faculty"
        element={
          <Protected role="faculty">
            <FacultyDashboard />
          </Protected>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={
              loggedIn
                ? `/${localStorage.getItem("college_role")}`
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}