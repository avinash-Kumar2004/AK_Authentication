import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import FloatingShapes from "./component/FloatingShapes";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./component/LoadingSpinner";
import ForgotPasswordPages from "./pages/ForgotPasswordPages";
import ResetPasswordPage from "./pages/ResetPasswordPage";
const ProtectRoute=({children})=>{
  const {isAuthenticated,user} =useAuthStore()
  if(!isAuthenticated){
    return <Navigate to={'/login'} replace/>
  }
  if(!user.isVerified){
  return <Navigate to={'/verify-email'}/>
  }
  return children
}
// Redirect logged-in & verified users
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const {isCheckingAuth, checkAuth,isAuthenticated,user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
if(isCheckingAuth) return <LoadingSpinner/>
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShapes color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShapes color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        <Route path="/" element={
          <ProtectRoute>
            <DashboardPage/>
          </ProtectRoute>
        } />

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/signup/create-password"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
          <LoginPage />
          </RedirectAuthenticatedUser>
          } />
       <Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPages />
						</RedirectAuthenticatedUser>
					}
				/>
        <Route path="/reset-password/:token" 
        element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage/>
          </RedirectAuthenticatedUser>
        }
        />
        {/*/not page found to handle this page */}
				<Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
