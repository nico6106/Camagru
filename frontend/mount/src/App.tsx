import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Page404 from "./pages/Page404";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
	<NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
		<Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
