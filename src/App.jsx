import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import VerifyEmailNoticePage from "./pages/VerifyEmailNoticePage/VerifyEmailNoticePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import MainPage from "./pages/MainPage/MainPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./features/auth/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNoticePage />} />
        <Route path="/" element={<HomePage/>}/>

        <Route path="/main" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
