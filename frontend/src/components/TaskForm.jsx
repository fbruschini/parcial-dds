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
  const [errors, setErrors] = useState({});
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
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!values.proyectoId) {
      nextErrors.proyectoId = "Selecciona un proyecto.";
    }

    if (!values.responsableId) {
      nextErrors.responsableId = "Selecciona un responsable.";
    }

    if (!values.titulo.trim()) {
      nextErrors.titulo = "Ingresa un titulo.";
    }

    if (!values.descripcion.trim()) {
      nextErrors.descripcion = "Ingresa una descripcion.";
    }

    if (!values.fechaLimite) {
      nextErrors.fechaLimite = "Selecciona una fecha limite.";
    }

    if (!isEditing && selectedProject && selectedProject.estado !== "activo") {
      nextErrors.proyectoId = `No se pueden crear tareas en un proyecto ${selectedProject.estado}.`;
    }

    if (selectedProject && values.responsableId && !selectedProject.integrantes.includes(values.responsableId)) {
      nextErrors.responsableId = "El responsable debe integrar el proyecto seleccionado.";
    }

    if (values.fechaLimite) {
      const deadline = new Date(`${values.fechaLimite}T23:59:59`);
      const minimumDate = isEditing && task?.createdAt ? new Date(task.createdAt) : new Date();

      if (deadline < minimumDate) {
        nextErrors.fechaLimite = isEditing
          ? "La fecha limite no puede ser anterior a la fecha de creacion."
          : "La fecha limite no puede ser anterior a hoy.";
      }
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
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
    <form className="card form-grid task-form" onSubmit={handleSubmit} noValidate>
      <label className="span-2">
        Proyecto
        <select
          name="proyectoId"
          value={values.proyectoId}
          onChange={updateField}
          disabled={isEditing}
          aria-invalid={Boolean(errors.proyectoId)}
          required
        >
          <option value="">Seleccionar proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.codigo} - {project.nombre} ({project.estado})
            </option>
          ))}
        </select>
        {errors.proyectoId && <span className="field-error">{errors.proyectoId}</span>}
      </label>
      <label className="span-2">
        Responsable
        <select
          name="responsableId"
          value={values.responsableId}
          onChange={updateField}
          disabled={!isAdminLike}
          aria-invalid={Boolean(errors.responsableId)}
          required
        >
          <option value="">Seleccionar responsable</option>
          {validUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre} ({user.rol})
            </option>
          ))}
        </select>
        {errors.responsableId && <span className="field-error">{errors.responsableId}</span>}
      </label>
      <label className="span-2">
        Titulo
        <input
          name="titulo"
          value={values.titulo}
          onChange={updateField}
          disabled={!isAdminLike}
          aria-invalid={Boolean(errors.titulo)}
          required
        />
        {errors.titulo && <span className="field-error">{errors.titulo}</span>}
      </label>
      <label className="span-2">
        Fecha limite
        <input
          type="date"
          name="fechaLimite"
          value={values.fechaLimite}
          onChange={updateField}
          disabled={!isAdminLike}
          aria-invalid={Boolean(errors.fechaLimite)}
          required
        />
        {errors.fechaLimite && <span className="field-error">{errors.fechaLimite}</span>}
      </label>
      <label className="wide">
        Descripcion
        <textarea
          name="descripcion"
          value={values.descripcion}
          onChange={updateField}
          aria-invalid={Boolean(errors.descripcion)}
          required
          rows="4"
        />
        {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
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
