import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ErrorMessage } from "../components/StatusMessage";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@dds.com", password: "Password123!" });
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
      await login(form);
      navigate("/tareas");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card card">
      <h1>Iniciar sesion</h1>
      <p>Usuario de prueba: admin@dds.com / Password123!</p>
      <ErrorMessage message={error} />
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={updateField} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p>
        ¿No tenes usuario? <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}
