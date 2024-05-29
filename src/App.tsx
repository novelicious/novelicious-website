import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Home from "./pages/Home.tsx";
import Market from "./pages/Market.tsx";

const App: React.FC = () => (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </>
);

export default App;
