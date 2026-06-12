import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card empty-state">
      <h1>Pagina no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <Link to="/tareas">Volver al listado</Link>
    </section>
  );
}
