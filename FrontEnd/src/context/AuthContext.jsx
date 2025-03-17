import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setUser({ token, role: userRole });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      const { token, role } = res.data;

      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Set user state with the token and role
      setUser({ token, role });

      return role; // Return role for use in Login component for navigation
    } catch (err) {
      console.error("Login failed:", err);
      return null; // You might want to return null or a custom error message here
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
