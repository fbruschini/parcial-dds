import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const PRIORIDADES = ["baja", "media", "alta", "critica"];
const ESTADOS = ["pendiente", "en_progreso", "bloqueada", "finalizada", "cancelada"];

function buildInitialValues(task) {
  return {
    proyectoId: task?.proyectoId || "",
    titulo: task?.titulo || "",
    descripcion: task?.descripcion || "",
    responsableId: task?.responsableId || "",
    prioridad: task?.prioridad || "media",
    estado: task?.estado || "pendiente",
    fechaLimite: task?.fechaLimite || "",
  };
}

export default function TaskForm({ task, projects, users, onSubmit, submitLabel }) {
  const { isAdminLike } = useAuth();
  const [values, setValues] = useState(() => buildInitialValues(task));
  const selectedProject = projects.find((project) => project.id === values.proyectoId);
  const validUsers = useMemo(() => {
    if (!selectedProject) {
      return users;
    }

    return users.filter((user) => selectedProject.integrantes.includes(user.id));
  }, [selectedProject, users]);
  const isEditing = Boolean(task);

  function updateField(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    if (name === "proyectoId") {
      nextValues.responsableId = "";
    }

    setValues(nextValues);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!values.titulo.trim() || !values.descripcion.trim() || !values.fechaLimite) {
      return;
    }

    const payload = isEditing
      ? {
          titulo: values.titulo,
          descripcion: values.descripcion,
          responsableId: values.responsableId,
          prioridad: values.prioridad,
          estado: values.estado,
          fechaLimite: values.fechaLimite,
        }
      : values;

    onSubmit(payload);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <label>
        Proyecto
        <select name="proyectoId" value={values.proyectoId} onChange={updateField} disabled={isEditing} required>
          <option value="">Seleccionar proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.codigo} - {project.nombre} ({project.estado})
            </option>
          ))}
        </select>
      </label>
      <label>
        Responsable
        <select name="responsableId" value={values.responsableId} onChange={updateField} disabled={!isAdminLike} required>
          <option value="">Seleccionar responsable</option>
          {validUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre} ({user.rol})
            </option>
          ))}
        </select>
      </label>
      <label>
        Titulo
        <input name="titulo" value={values.titulo} onChange={updateField} disabled={!isAdminLike} required />
      </label>
      <label>
        Fecha limite
        <input
          type="date"
          name="fechaLimite"
          value={values.fechaLimite}
          onChange={updateField}
          disabled={!isAdminLike}
          required
        />
      </label>
      <label className="wide">
        Descripcion
        <textarea name="descripcion" value={values.descripcion} onChange={updateField} required rows="4" />
      </label>
      <label>
        Prioridad
        <select name="prioridad" value={values.prioridad} onChange={updateField} disabled={!isAdminLike}>
          {PRIORIDADES.map((prioridad) => (
            <option key={prioridad} value={prioridad}>
              {prioridad}
            </option>
          ))}
        </select>
      </label>
      <label>
        Estado
        <select name="estado" value={values.estado} onChange={updateField}>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </label>
      <div className="actions-row wide">
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
