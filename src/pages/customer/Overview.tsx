import { useAuth } from "../../context/AuthContext";

export default function Overview() {
  const { user } = useAuth();
  return <h1 className="mb-8 text-2xl font-bold">Welcome back, {user?.fullName || user?.email}</h1>;
}
