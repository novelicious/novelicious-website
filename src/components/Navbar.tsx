import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import novelicious from "/novelicious.png";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";
import axios from "axios";

interface User {
  id: number;
  username: string;
}

const Navbar: React.FC = () => {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  // Menu
  const menuRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isSideMenuOpen, setMenu] = useState(false);
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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");

    setIsLoggedIn(false);
    navigate("/");
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const navlinks = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Market",
      link: "/market",
    },
  ];
  const profileNavlinks = [
    {
      label: "Edit Profile",
      link: "/profile",
    },
    {
      label: "For You",
      link: "/for-you",
    },
  ];

  return (
    <nav className="flex justify-between px-8 items-center py-6  bg-neutral ">
      <div className="flex items-center gap-8">
        <section className="flex items-center gap-4">
          {/* menu */}
          <FiMenu
            onClick={() => setMenu(true)}
            className="text-3xl cursor-pointer lg:hidden"
          />
          {/* logo */}
          <Link to={"/"} className="flex gap-x-2 text-4xl font-mono">
            <img
              src={novelicious}
              alt="novelicious"
              className=" object-fit h-11"
            />
            <p className="text-[1.5rem]">
              novel<span className=" text-neutral bg-primary">icious</span>
            </p>
          </Link>
        </section>
        {navlinks.map((d, i) => (
          <Link
            key={i}
            className="hidden lg:block text-primary relative text-md w-fit after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left"
            to={d.link}
          >
            {d.label}
          </Link>
        ))}
      </div>

      {/* sidebar mobile menu */}
      <div
        className={clsx(
          "fixed h-full w-screen lg:hidden  top-0 right-0 -translate-x-full transition-all ",
          isSideMenuOpen && "translate-x-0"
        )}
      >
        <section className="text-black bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 w-56 flex  ">
          <IoCloseOutline
            onClick={() => setMenu(false)}
            className="mt-0 mb-8 text-3xl cursor-pointer"
          />

          {navlinks.map((d, i) => (
            <Link key={i} className="font-bold" to={d.link}>
              {d.label}
            </Link>
          ))}
        </section>
      </div>

      {/* last section */}
      <section className=" items-center gap-4">
        {isLoggedIn ? (
          <>
            <img
              src="https://m.media-amazon.com/images/I/81iDNjn-r3L._AC_UF1000,1000_QL80_.jpg"
              className="h-8 w-8 rounded-full cursor-pointer"
              width={40}
              height={40}
              onClick={() => setOpen(!open)}
              ref={imgRef}
            />
            {open && (
              <div
                ref={menuRef}
                className="p-4 w-52 bg-white shadow-lg absolute"
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
                  className="p-2 text-lg cursor-pointer rounded hover:underline"
                  onClick={() => setOpenModal(true)}
                >
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
