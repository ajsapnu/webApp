import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
                <Route path="/employees/:id" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />

                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}