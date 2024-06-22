import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import clsx from "clsx";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [isSideMenuOpen, setMenu] = useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
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
    {
      label: "For You",
      link: "/for-you",
    },
  ];

  return (
    <nav className="flex justify-between px-8 items-center py-6   ">
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
              src=" ./public/novelicious.png"
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
            className="hidden lg:block  text-gray-400 hover:text-black"
            to={d.link}
          >
            {d.label}
          </Link>
        ))}
      </div>

      {/* sidebar mobile menu */}
      <div
        className={clsx(
          " fixed h-full w-screen lg:hidden bg-black/50  backdrop-blur-sm top-0 right-0  -translate-x-full  transition-all ",
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
      <section className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button onClick={() => setOpenModal(true)}>
              {" "}
              <img
                width={40}
                height={40}
                className="h-8 w-8 rounded-full "
                src="https://m.media-amazon.com/images/I/81iDNjn-r3L._AC_UF1000,1000_QL80_.jpg"
                alt="avatar-img"
              />
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
          </>
        ) : (
          <Link to={`/login`}>
            {" "}
            <img
              width={40}
              height={40}
              className="h-8 w-8 rounded-full "
              src="https://m.media-amazon.com/images/I/81iDNjn-r3L._AC_UF1000,1000_QL80_.jpg"
              alt="avatar-img"
            />
          </Link>
        )}
        {/* nanti buat pfp kalo jadi */}
      </section>
    </nav>
  );
};

export default Navbar;
