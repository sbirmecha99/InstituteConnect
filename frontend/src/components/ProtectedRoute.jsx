import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    let isMounted=true;
    fetch("http://localhost:3000/api/auth/verify", {
      credentials: "include",
    })
      .then((res) =>{
        console.log("verify status:",res.status)
        if (!res.ok)throw new Error("Not authenticated");
        return res.json();
      })
      .then((data)=>{
        console.log("verify success:",data);
       if(isMounted) setAuth(true);
      })
      .catch((err)=>{
        console.error("verify failed:",err);
        if (isMounted)setAuth(false);
      });
      return()=>{
        isMounted=false;
      };
    },[]);

  if (auth === null) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30vh" }}
      >
        <h2><CircularProgress/></h2>
      </div>
    );
  }
  
  if (!auth) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
