import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface RegisterState {
  username: string;
  password: string;
  confirmPassword: string;
  picture: string;
  gender: string;
  birth_year: number;
  error: string;
  loading: boolean;
}

const Register: React.FC = () => {
  const [state, setState] = useState<RegisterState>({
    username: "",
    password: "",
    confirmPassword: "",
    picture: "",
    gender: "",
    birth_year: new Date().getFullYear(),
    error: "",
    loading: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.password === state.confirmPassword && state.password.length > 5) {
      setState({ ...state, loading: true, error: "" });

      const formDetails = {
        username: state.username,
        password: state.password,
        picture: state.picture,
        gender: state.gender,
        birth_year: state.birth_year,
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDetails),
        });

        setState({ ...state, loading: false });

        if (response.ok) {
          navigate("/login");
        } else {
          const errorData = await response.json();
          setState({
            ...state,
            error: errorData.detail || "Registration failed!",
          });
        }
      } catch (error) {
        setState({
          ...state,
          loading: false,
          error: "An error occurred. Please try again later.",
        });
      }
    } else {
      setState({
        ...state,
        error:
          "Ensure that the passwords match and are greater than 5 characters.",
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
              <h1 className="ml-5 text-md font-semibold">Sign Up</h1>
            </div>

            <p className="mt-4 leading-relaxed text-gray-500">register.</p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="username"
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

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={state.password}
                    placeholder="********"
                    onChange={(e) =>
                      setState({ ...state, password: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                    value={state.confirmPassword}
                    onChange={(e) =>
                      setState({ ...state, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our terms and conditions
                  and privacy policy.
                </p>
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={state.loading}
                  className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
                >
                  {state.loading ? "Signing Up..." : "Sign Up"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link className="text-gray-700 underline" to={`/login`}>
                    {" "}
                    Sign In
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

export default Register;
