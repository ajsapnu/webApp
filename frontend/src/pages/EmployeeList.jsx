import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import './EmployeeList.css';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

    const loadEmployees = async () => {
        try {
            const { data } = await API.get("/Employee");
            setEmployees(data);
        } catch (error) {
            console.error("Failed to load employees:", error);
        }
    };

    const deleteEmployee = async (id) => {
        if (window.confirm("Delete this employee?")) {
            try {
                await API.delete(`/Employee/${id}`);
                loadEmployees();
            } catch (error) {
                console.error("Failed to delete employee:", error);
            }
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const filtered = employees.filter((e) =>
        [e.firstName, e.lastName, e.email]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div className="p-4">
                <div className="flex justify-between mb-4">
                    <input
                        className="border"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Link to="/Employees/new" className="add-employee-btn">
                        Add Employee
                    </Link>
                </div>
                <table>
                    <thead>
                        <tr className="table-header-row">
                            <th className="table-header-cell">First Name</th>
                            <th className="table-header-cell">Last Name</th>
                            <th className="table-header-cell">Email</th>
                            <th className="table-header-cell">Phone</th>
                            <th className="table-header-cell">Position</th>
                            <th className="table-header-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((emp) => (
                            <tr key={emp.id}>
                                <td className="table-cell">{emp.firstName}</td>
                                <td className="table-cell">{emp.lastName}</td>
                                <td className="table-cell">{emp.email}</td>
                                <td className="table-cell">{emp.phone}</td>
                                <td className="table-cell">{emp.position}</td>
                                <td className="table-cell action-buttons">
                                    <Link
                                        to={`/employees/${emp.id}`}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteEmployee(emp.id)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
