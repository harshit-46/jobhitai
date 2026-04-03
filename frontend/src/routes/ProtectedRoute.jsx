import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user , loading} = useAuth();

    if(loading) return <h1 className="bg-[#0a0a0e] text-white">Loading...</h1>;;

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

export default ProtectedRoute;