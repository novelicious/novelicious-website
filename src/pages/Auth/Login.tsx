import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

            <p className="mt-4 leading-relaxed text-gray-500">Login Page.</p>

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

                <div className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={state.username}
                    onChange={(e) =>
                      setState({ ...state, username: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md  focus:outline-none focus:ring"
                  />
                  <div className="items-center   border-t border-gray-200">
                    <label
                      htmlFor="Password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="Password"
                      name="password"
                      value={state.password}
                      onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                      }
                      className=" w-full rounded-md focus:outline-none focus:ring"
                    />
                  </div>
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
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  {state.loading ? "Logging in..." : "Sign In"}
                </button>

                <a
                  className="group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring"
                  href="#"
                ></a>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  You don't have an account?
                  <a href="/register" className="text-gray-700 underline">
                    Sign Up
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

export default Login;
