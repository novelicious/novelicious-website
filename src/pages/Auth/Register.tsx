import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="/">
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
                  value={state.username}
                  onChange={(e) =>
                    setState({ ...state, username: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
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
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
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
                  value={state.confirmPassword}
                  onChange={(e) =>
                    setState({ ...state, confirmPassword: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
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
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
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
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  onChange={(e) =>
                    setState({ ...state, birth_year: parseInt(e.target.value) })
                  }
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  disabled={state.loading}
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  {state.loading ? "Registering..." : "Sign Up"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <a href="/login" className="text-gray-700 underline">
                    Login
                  </a>
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
