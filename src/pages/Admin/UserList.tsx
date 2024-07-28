import React, { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  gender: string;
  address: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Username
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Gender
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-gray-700">
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.id}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.gender}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {user.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
