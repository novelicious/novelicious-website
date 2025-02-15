import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import novelicious from "/novelicious.png";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { IoLogOutSharp } from "react-icons/io5";
import { RiFilePaper2Fill } from "react-icons/ri";
interface User {
  id: number;
  username: string;
  role_id: number;
}

const Navbar: React.FC = () => {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  // Menu
  const menuRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

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
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    setIsLoggedIn(false);
    navigate("/");
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const profileNavlinks = [
    {
      label: (
        <div className="flex">
          <span className="my-1 mr-2">
            <FaUserEdit />
          </span>
          Edit Profile
        </div>
      ),
      link: "/profile",
    },
    {
      label: (
        <div className="flex">
          <span className="my-1 mr-2">
            <FaHeart />
          </span>
          Favorites
        </div>
      ),
      link: "/favorites",
    },
    {
      label: (
        <div className="flex">
          <div className="my-1 mr-2">
            <RiFilePaper2Fill />
          </div>
          Transactions
        </div>
      ),
      link: "/transactions",
    },
  ];

  if (user?.role_id === 1) {
    profileNavlinks.push({
      label: (
        <div className="flex">
          <div className="my-1 mr-2">
            <RiFilePaper2Fill />
          </div>
          Admin
        </div>
      ),
      link: "/admin",
    });
  }

  return (
    <nav className="flex justify-between px-8 items-center py-6  bg-neutral ">
      <div className="flex items-center gap-8">
        <section className="flex items-center gap-4">
          {/* logo */}
          <Link to={"/"} className="flex gap-x-2 text-4xl font-mono">
            <img
              src={novelicious}
              alt="novelicious"
              className="object-fit h-11"
            />
            <p className="text-[1.5rem]">
              <span className="text-neutral bg-primary">novel</span>icious
            </p>
          </Link>
        </section>
      </div>

      {/* sidebar mobile menu */}

      {/* last section */}
      <section className=" items-center gap-4">
        {isLoggedIn ? (
          <>
            <img
              src={novelicious}
              className="h-8 w-8 cursor-pointer border-2 border-primary rounded-full"
              width={40}
              height={40}
              onClick={() => setOpen(!open)}
              ref={imgRef}
            />
            {open && (
              <div
                ref={menuRef}
                className="p-4 w-52 bg-white border-2 shadow-lg absolute right-5 z-50 overflow-auto max-h-96"
              >
                {user && <h1>Hi, {user.username}</h1>}

                <ul>
                  {profileNavlinks.map((d, i) => (
                    <li
                      onClick={() => setOpen(false)}
                      className="p-2 text-lg cursor-pointer rounded hover:underline"
                      key={i}
                    >
                      <Link key={i} to={d.link}>
                        {d.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  className=" flex p-2 text-lg cursor-pointer rounded hover:underline "
                  onClick={() => setOpenModal(true)}
                >
                  <span className="my-1 mr-2">
                    {" "}
                    <IoLogOutSharp />
                  </span>
                  Sign Out
                </button>
                <Modal open={openModal} onClose={onCloseModal} center>
                  <h2 className="underline">Sign Out</h2>
                  <p>Are you sure you want to sign out?</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={handleSignOut}
                      className="bg-primary text-neutral px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={onCloseModal}
                      className="bg-gray-300 text-primary px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </Modal>
              </div>
            )}
          </>
        ) : (
          <Link to={`/login`}>
            {" "}
            <button className="bg-primary text-neutral px-4 py-2 rounded">
              Sign In
            </button>
          </Link>
        )}
        {/* nanti buat pfp kalo jadi */}
      </section>
    </nav>
  );
};

export default Navbar;
