const ESTADOS = ["pendiente", "en_progreso", "bloqueada", "finalizada", "cancelada"];
const PRIORIDADES = ["baja", "media", "alta", "critica"];

export default function TaskFilters({ filters, projects, users, onChange, onSubmit, onReset }) {
  function updateField(event) {
    onChange({ ...filters, [event.target.name]: event.target.value, page: 1 });
  }

  return (
    <form className="card filters-grid" onSubmit={onSubmit}>
      <label>
        Proyecto
        <select name="proyectoId" value={filters.proyectoId} onChange={updateField}>
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.codigo} - {project.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Responsable
        <select name="responsableId" value={filters.responsableId} onChange={updateField}>
          <option value="">Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Estado
        <select name="estado" value={filters.estado} onChange={updateField}>
          <option value="">Todos</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </label>
      <label>
        Prioridad
        <select name="prioridad" value={filters.prioridad} onChange={updateField}>
          <option value="">Todas</option>
          {PRIORIDADES.map((prioridad) => (
            <option key={prioridad} value={prioridad}>
              {prioridad}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ordenar por
        <select name="sortBy" value={filters.sortBy} onChange={updateField}>
          <option value="createdAt">Creacion</option>
          <option value="fechaLimite">Fecha limite</option>
          <option value="prioridad">Prioridad</option>
          <option value="estado">Estado</option>
          <option value="titulo">Titulo</option>
        </select>
      </label>
      <label>
        Orden
        <select name="order" value={filters.order} onChange={updateField}>
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </label>
      <div className="actions-row">
        <button type="submit">Aplicar</button>
        <button type="button" className="secondary" onClick={onReset}>
          Limpiar
        </button>
      </div>
    </form>
  );
}
