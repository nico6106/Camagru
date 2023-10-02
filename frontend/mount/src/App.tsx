import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Page404 from "./pages/Page404";
import NavBar from "./components/NavBar";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";

function App() {
  return (
    <BrowserRouter>
	<NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
		<Route path="/confirm/:idConfirm" element={<ConfirmEmailPage />} />
		<Route path="/404" element={<Page404 />} />
		<Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
