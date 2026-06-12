import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ErrorMessage } from "../components/StatusMessage";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "colaborador",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/tareas" replace />;
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/tareas");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card card">
      <h1>Registro</h1>
      <ErrorMessage message={error} />
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={updateField} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={updateField} required />
        </label>
        <label>
          Rol
          <select name="rol" value={form.rol} onChange={updateField}>
            <option value="colaborador">colaborador</option>
            <option value="lider">lider</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>
      <p>
        ¿Ya tenes usuario? <Link to="/login">Ingresar</Link>
      </p>
    </section>
  );
}
