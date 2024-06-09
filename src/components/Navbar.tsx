import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 bg-neutral z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse text-2xl font-semibold  "
        >
          {" "}
          novel
          <span className="self-center whitespace-nowrap bg-primary text-neutral">
            icious.
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral">
            <li className="text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
              <Link to={`/`}>Home</Link>
            </li>
            <li className="text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
              <Link to={`/market`}>Market</Link>
            </li>
            {isLoggedIn ? (
              <li className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-600 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
                <button
                  onClick={handleSignOut}
                  className="lg:bg-blue-600 lg:px-2 lg:text-neutral text-blue-600"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li className=" relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
                <button className=" lg:bg-primary lg:px-2 lg:text-neutral text-primary">
                  <Link to={`/login`}>Sign In</Link>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
