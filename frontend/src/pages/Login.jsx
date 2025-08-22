// pages/Login.jsx
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { loginWithRedirect } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Sign in</h1>
            <button
                onClick={loginWithRedirect}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
                Continue with Auth0
            </button>
        </div>
    );
}
