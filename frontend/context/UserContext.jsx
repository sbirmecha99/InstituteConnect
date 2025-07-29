import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/me", {
          headers:token?{Authorization: `Bearer ${token}`}:{},
          withCredentials: !token,
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
