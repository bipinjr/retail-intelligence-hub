import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ConsumerDashboard() {
  const { role } = useAuth();
  if (role !== "consumer") return <Navigate to="/home" replace />;
  return <Navigate to="/home" replace />;
}
