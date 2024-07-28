import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [bookCount, setBookCount] = useState<number>(0);

  useEffect(() => {
    // Fetch the user count
    axios
      .get("http://127.0.0.1:8000/users")
      .then((res) => {
        setUserCount(res.data.length);
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch the book count
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        setBookCount(res.data.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <div className="text-primary mr-4">
            <i className="ri-user-line text-4xl"></i>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{userCount}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <div className="text-primary mr-4">
            <i className="ri-book-line text-4xl"></i>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Total Books</p>
            <p className="text-2xl font-bold text-gray-900">{bookCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
