import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Page404 from './pages/Page404';
import NavBar from './components/NavBar';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import { UserProvider } from './context/UserContext';
import SignInPage from './pages/SignInPage';
import SignOutPage from './pages/SignOutPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <UserProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/confirm/:idConfirm"
                        element={<ConfirmEmailPage />}
                    />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signout" element={<SignOutPage />} />
					<Route path="/forgot/:idConfirm" element={<ResetPasswordPage />} />
                    <Route path="/forgot" element={<ForgotPasswordPage />} />
					<Route path="/settings" element={<SettingsPage />} />
                    <Route path="/404" element={<Page404 />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
