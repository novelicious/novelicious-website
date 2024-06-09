import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
        <main className="bg-white flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-primary" href="/">
              <span className="">Home</span>
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              novelicious.
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">Register Page.</p>

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
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="picture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Picture
                </label>

                <input
                  type="file"
                  id="picture"
                  name="picture"
                  value={state.picture}
                  onChange={(e) =>
                    setState({ ...state, picture: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="birth_year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Birth Year
                </label>

                <input
                  type="number"
                  id="birth_year"
                  name="birth_year"
                  value={state.birth_year}
                  placeholder="Birth Year"
                  onChange={(e) =>
                    setState({ ...state, birth_year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={state.gender}
                  onChange={(e) =>
                    setState({ ...state, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={state.password}
                  placeholder="********"
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="********"
                  value={state.confirmPassword}
                  onChange={(e) =>
                    setState({ ...state, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm  border-2 border-primary focus:ring-0 focus:border-primary "
                />
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={state.loading}
                  className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
                >
                  {state.loading ? "Registering..." : "Sign Up"}
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
