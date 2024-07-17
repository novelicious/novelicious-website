import React from "react";

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div
      className={`fixed left-0 top-0 w-64 h-full bg-primary p-4 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <a href="#" className="flex items-center pb-4 border-b border-b-primary">
        <img
          src="../../public/novelicious.png"
          alt=""
          className="w-8 h-8 rounded object-cover"
        />
        <span className="text-lg font-bold text-white ml-3">novelicious</span>
      </a>
      <ul className="mt-4">
        <li className="mb-1 group active">
          <a
            href="#"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
          >
            <i className="ri-home-2-line mr-3 text-lg"></i>
            <span className="text-sm "> Book List</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
