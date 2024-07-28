import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FiMenu } from "react-icons/fi";
import axios from "axios";

export interface UserAdmin {
  id: number;
  username: string;
  role_id: number;
}

const SidebarLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserAdmin | null>(null);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/verify-token/${token}`
        );

        if (!response.ok) {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!userId) {
      console.log("User is not logged in.");
      navigate("/");
      return;
    }
    axios
      .get(`http://127.0.0.1:8000/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error(error);
        setIsLoggedIn(false);
      });
  }, [userId]);

  return (
    <section className="flex">
      {isLoggedIn && user && user.role_id === 1 && (
        <>
          <Sidebar isOpen={isSidebarOpen} />
          <main
            className={`flex-1 transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <div className="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
              <button
                type="button"
                className="text-lg text-gray-600"
                onClick={toggleSidebar}
              >
                <FiMenu />
              </button>
            </div>
            <Outlet />
          </main>
        </>
      )}
      {isLoggedIn && user && user.role_id !== 1 && <>{navigate("/")}</>}
    </section>
  );
};

export default SidebarLayout;
