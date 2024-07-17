import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookList from "./BookList";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";

export interface UserAdmin {
  id: number;
  username: string;
  role_id: number;
}

const Dashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserAdmin | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      console.log(token);

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

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .get(`http://127.0.0.1:8000/users/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setIsLoggedIn(!!token);
  }, [userId, token]);

  return (
    <>
      <div>
        {isLoggedIn ? (
          <>
            {user && user.role_id === 1 ? (
              <section className="flex">
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
                    <p className="ml-2">Book List</p>
                  </div>
                  <BookList />
                </main>
              </section>
            ) : (
              <h1>You have a non-Admin role ☠️☠️🙏🙏</h1>
            )}
          </>
        ) : (
          <h1>Please log in</h1>
        )}
      </div>
    </>
  );
};

export default Dashboard;
