import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, fetchTask, updateTask } from "../api/tareas";
import { fetchProjects } from "../api/proyectos";
import { fetchUsers } from "../api/usuarios";
import { getErrorMessage } from "../api/client";
import TaskForm from "../components/TaskForm";
import { ErrorMessage, LoadingMessage, SuccessMessage } from "../components/StatusMessage";

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const requests = [fetchProjects(), fetchUsers()];
        if (isEditing) {
          requests.push(fetchTask(id));
        }
        const [projectsData, usersData, taskData] = await Promise.all(requests);
        setProjects(projectsData);
        setUsers(usersData);
        setTask(taskData || null);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isEditing]);

  async function handleSubmit(payload) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const saved = isEditing ? await updateTask(id, payload) : await createTask(payload);
      setSuccess("Tarea guardada correctamente");
      setTimeout(() => navigate(`/tareas/${saved.id}`), 500);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{isEditing ? "Editar tarea" : "Nueva tarea"}</h1>
          <p>Las validaciones de negocio se confirman nuevamente en backend.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      <TaskForm
        task={task}
        projects={projects}
        users={users}
        onSubmit={handleSubmit}
        submitLabel={saving ? "Guardando..." : "Guardar tarea"}
      />
    </>
  );
}
