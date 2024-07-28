import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div
      className={`fixed left-0 top-0 w-64 h-full bg-primary p-4 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link
        to="/admin"
        className="flex items-center pb-4 border-b border-b-primary"
      >
        <img
          src="../../public/novelicious.png"
          alt=""
          className="w-8 h-8 rounded object-cover"
        />
        <span className="text-lg font-bold text-white ml-3">novelicious</span>
      </Link>
      <ul className="mt-4">
        <li className="mb-1 group">
          <Link
            to="/"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
          >
            <i className="ri-book-2-line mr-3 text-lg"></i>
            <span className="text-sm">Back </span>
          </Link>
        </li>
        <li className="mb-1 group">
          <Link
            to="/admin/books"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
          >
            <i className="ri-book-2-line mr-3 text-lg"></i>
            <span className="text-sm">Book List</span>
          </Link>
        </li>
        <li className="mb-1 group">
          <Link
            to="/admin/users"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
          >
            <i className="ri-user-line mr-3 text-lg"></i>
            <span className="text-sm">User List</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
