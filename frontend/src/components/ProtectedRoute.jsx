import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/verify", {
      credentials: "include",
    })
      .then((res) => setAuth(res.ok))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
