export default function SummaryCards({ summary }) {
  return (
    <div className="summary-grid">
      <section className="card">
        <h2>Tareas por estado</h2>
        <ul className="metric-list">
          {Object.entries(summary.tareasPorEstado).map(([estado, cantidad]) => (
            <li key={estado}>
              <span>{estado}</span>
              <strong>{cantidad}</strong>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Tareas vencidas</h2>
        <p className="big-number">{summary.tareasVencidas.length}</p>
        <ul>
          {summary.tareasVencidas.slice(0, 5).map((task) => (
            <li key={task.id}>
              {task.titulo} · {task.fechaLimite}
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Carga por responsable</h2>
        <ul className="metric-list">
          {summary.cargaPorResponsable.map((item) => (
            <li key={item.responsableId}>
              <span>{item.nombre}</span>
              <strong>{item.cantidad}</strong>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Prioridad critica</h2>
        <p className="big-number">{summary.tareasCriticas}</p>
      </section>
    </div>
  );
}
