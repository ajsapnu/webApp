import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import './EmployeeList.css';

export default function EmployeeForm() {
    const { id } = useParams();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (id && id !== "new") {
            API.get(`/Employee/${id}`)
                .then(({ data }) => setForm(data))
                .catch((err) => console.error("Failed to load employee:", err));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id === "new") {
                await API.post("/Employee", form); 
            } else {
                await API.put(`/Employee/${id}`, form); 
            }
            navigate("/employees"); 
        } catch (error) {
            console.error("Failed to save employee:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <form className="max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">
                    {id === "new" ? "Add Employee" : "Edit Employee"}
                </h2>
                <div className="form-row">
                    {["firstName", "lastName", "email", "phone", "position"].map((field) => (
                        <input
                            key={field}
                            className="form-input"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={form[field]}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                            required={field !== "phone" && field !== "position"}
                            type={field === "email" ? "email" : "text"}
                        />
                    ))}
                </div>
                <button type="submit" className="btn-save">
                    Save
                </button>
            </form>
        </div>
    );
}
