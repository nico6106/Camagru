import {
    BrowserRouter as Router,
    Routes,
    Route,
    BrowserRouter,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Page404 from './pages/Page404';
import NavBar from './components/NavBar';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import { UserProvider } from './context/UserContext';
import SignInPage from './pages/SignInPage';

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/confirm/:idConfirm"
                        element={<ConfirmEmailPage />}
                    />
					<Route path="/signin" element={<SignInPage />} />
                    <Route path="/404" element={<Page404 />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
