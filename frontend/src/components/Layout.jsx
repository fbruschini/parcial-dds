import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, isAuthenticated, isAdminLike, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/tareas">
          DDS Tareas
        </Link>
        <nav>
          {isAuthenticated ? (
            <>
              <NavLink to="/tareas">Tareas</NavLink>
              {isAdminLike && <NavLink to="/tareas/nueva">Nueva tarea</NavLink>}
              {isAdminLike && <NavLink to="/resumen">Resumen</NavLink>}
              <span className="user-pill">
                {user.nombre} · {user.rol}
              </span>
              <button className="link-button" type="button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
