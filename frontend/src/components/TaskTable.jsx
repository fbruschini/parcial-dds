import { Link } from "react-router-dom";

export default function TaskTable({ tasks }) {
  if (tasks.length === 0) {
    return <div className="card empty-state">No hay tareas para los filtros seleccionados.</div>;
  }

  return (
    <div className="table-wrapper card">
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Proyecto</th>
            <th>Responsable</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha limite</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.vencida ? "is-overdue" : ""}>
              <td>{task.titulo}</td>
              <td>{task.proyecto?.codigo || task.proyectoId}</td>
              <td>{task.responsable?.nombre || task.responsableId}</td>
              <td>
                <span className={`badge priority-${task.prioridad}`}>{task.prioridad}</span>
              </td>
              <td>
                <span className={`badge state-${task.estado}`}>{task.estado}</span>
              </td>
              <td>{task.fechaLimite}</td>
              <td>
                <Link to={`/tareas/${task.id}`}>Ver detalle</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
