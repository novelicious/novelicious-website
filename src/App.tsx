import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Home from "./pages/Home.tsx";
import Market from "./pages/Market.tsx";
import Login from "./pages/Auth/Login.tsx";
import Details from "./pages/Details.tsx";
import Cart from "./pages/Cart.tsx";
import Recommendation from "./pages/Recommendation.tsx";
import Register from "./pages/Auth/Register.tsx";
import ProtectedPage from "./Protected.tsx";

const App: React.FC = () => (
  <div className=" bg-neutral">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/novel/:id" element={<Details />}></Route>
        <Route path="/ask/:id" element={<Details />}></Route>
        <Route path="/for-you" element={<Recommendation />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/protected" element={<ProtectedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </div>
);

export default App;
