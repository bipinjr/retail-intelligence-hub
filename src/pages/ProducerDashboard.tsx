import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Producer dashboard alias — landing surface inside the producer area.
// Redirects to the role-aware HomePage which shows the producer toolkit.
export default function ProducerDashboard() {
  const { role } = useAuth();
  if (role !== "producer") return <Navigate to="/home" replace />;
  return <Navigate to="/home" replace />;
}
