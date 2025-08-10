import React from "react";
import { useNavigate } from "react-router-dom";
import '../pages/EmployeeList.css';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h1>Employee Management</h1>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
    );
}
