import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Market from "./pages/Market.tsx";
import Login from "./pages/Auth/Login.tsx";
import Details from "./pages/Details.tsx";
import Cart from "./pages/Cart.tsx";
import Register from "./pages/Auth/Register.tsx";
import ProtectedPage from "./Protected.tsx";
import Favorites from "./pages/Favorites.tsx";
import Checkout from "./pages/Checkout.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import SidebarLayout from "./components/SidebarLayout.tsx";
import Transaction from "./pages/Transaction.tsx";
import Transactions from "./pages/Transactions.tsx";
import BookList from "./pages/Admin/BookList.tsx";
import UserList from "./pages/Admin/UserList.tsx";
import Dashboard from "./pages/Admin/Dashboard.tsx";
const App: React.FC = () => (
  <div className=" bg-neutral">
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Market />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/novel/:id" element={<Details />}></Route>
        <Route path="/ask/:id" element={<Details />}></Route>
        <Route path="/favorites" element={<Favorites />}></Route>
        <Route path="/checkout/:id" element={<Checkout />}></Route>
        <Route path="/transactions" element={<Transactions />}></Route>
        <Route path="/transaction/:id" element={<Transaction />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/protected" element={<ProtectedPage />} />
        {/* Admin routes */}
        <Route path="/admin" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookList />} />
          <Route path="users" element={<UserList />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </div>
);

export default App;
