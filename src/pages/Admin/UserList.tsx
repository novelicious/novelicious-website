import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export interface User {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string;
  cost: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    let isMounted = true;

    axios
      .get("http://127.0.0.1:8000/users")
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          setUsers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.id}</li>
      ))}
    </ul>
  );
};

export default UserList;
