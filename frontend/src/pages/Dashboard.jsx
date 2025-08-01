import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/authverify`, { withCredentials: true })
      .then((res) => {
        const role = res.data.role;
        switch (role) {
          case "SuperAdmin":
            navigate("/dashboard/dean");
            break;
          case "Admin":
            navigate("/dashboard/hod");
            break;
          case "Prof":
            navigate("/dashboard/professor");
            break;
          case "Student":
            navigate("/dashboard/student");
            break;
          default:
            navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  return <div>Loading your dashboard...</div>;
}

export default Dashboard;
