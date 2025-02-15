import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginState {
  username: string;
  password: string;
  error: string;
  loading: boolean;
}

const Login: React.FC = () => {
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    error: "",
    loading: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!state.username || !state.password) {
      setState({ ...state, error: "Username and password are required" });
      return false;
    }
    setState({ ...state, error: "" });
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setState({ ...state, loading: true });

    const formDetails = new URLSearchParams();
    formDetails.append("username", state.username);
    formDetails.append("password", state.password);

    try {
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formDetails,
      });

      setState({ ...state, loading: false });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role_id", data.role_id);
        navigate("/market");
      } else {
        const errorData = await response.json();
        setState({
          ...state,
          error: errorData.detail || "Authentication failed!",
        });
      }
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <section>
      <div className="flex justify-center items-center min-h-screen ">
        <main className="animate-fade bg-white border-2 border-black flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="flex items-center">
              <Link to="/">
                <IoMdArrowRoundBack />
              </Link>
              <h1 className="ml-5 text-md font-semibold">Sign In</h1>
            </div>

            {/* <p className="mt-4 leading-relaxed text-gray-500">login.</p> */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={state.username}
                  onChange={(e) =>
                    setState({ ...state, username: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                />
                <div className="items-center border-t border-gray-200">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="Password"
                      name="password"
                      placeholder="********"
                      value={state.password}
                      onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={state.loading}
                  className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
                >
                  {state.loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  You don't have an account?
                  <Link className="text-gray-700 underline" to={`/register`}>
                    {" "}
                    Sign Up
                  </Link>
                  .
                </p>
              </div>
            </form>
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;
