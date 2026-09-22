import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./app/login";
import EmployeeLayout from "./app/employee/_layout";
import MyRequests from "./app/employee/MyRequests";
import CreateRequest from "./app/employee/CreateRequest";
import ManagerLayout from "./app/manager/_layout";
import Requests from "./app/manager/Requests";
import Request from "./app/manager/Request";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute role="Employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MyRequests />} />
        <Route path="new" element={<CreateRequest />} />
      </Route>

      <Route
        path="/manager"
        element={
          <ProtectedRoute role="Manager">
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Requests />} />
        <Route path=":id" element={<Request />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
