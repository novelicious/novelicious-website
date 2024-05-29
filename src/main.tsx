import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ErrorPage from "./error-page.tsx";
// import Home from "./pages/Home.tsx";
// import Market from "./pages/Market.tsx";
import App from "./App.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/market",
//     element: <Market />,
//     errorElement: <ErrorPage />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <RouterProvider router={router}></RouterProvider> */}
    <App></App>
  </React.StrictMode>
);
