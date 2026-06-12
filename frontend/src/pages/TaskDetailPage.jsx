import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTask, fetchTaskHistory } from "../api/tareas";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskActions from "../components/TaskActions";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";
import { formatDate } from "../utils/date";

export default function TaskDetailPage() {
  const { id } = useParams();
  const { user, isAdminLike } = useAuth();
  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setError("");

      try {
        const [taskData, historyData] = await Promise.all([fetchTask(id), fetchTaskHistory(id)]);
        setTask(taskData);
        setHistory(historyData);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  if (loading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!task) {
    return <ErrorMessage message="No se encontro la tarea" />;
  }

  const canEdit = isAdminLike || task.responsableId === user?.id;

  return (
    <div className="detail-grid">
      <section className="card task-detail-card">
        <div className="task-detail-header">
          <div>
            <h1>{task.titulo}</h1>
            <p>
              {task.proyecto?.nombre} · responsable {task.responsable?.nombre}
            </p>
          </div>
          {canEdit && <Link to={`/tareas/${task.id}/editar`}>Editar</Link>}
        </div>
        <dl className="definition-list">
          <dt>Descripcion</dt>
          <dd>{task.descripcion}</dd>
          <dt>Prioridad</dt>
          <dd>
            <span className={`badge priority-${task.prioridad}`}>{task.prioridad}</span>
          </dd>
          <dt>Estado</dt>
          <dd>
            <span className={`badge state-${task.estado}`}>{task.estado}</span>
          </dd>
          <dt>Fecha limite</dt>
          <dd>
            {formatDate(task.fechaLimite)} {task.vencida && <strong className="danger-text">(vencida)</strong>}
          </dd>
          <dt>Creada</dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </dl>
      </section>
      <TaskActions task={task} onChanged={setTask} />
      <section className="card wide-card task-history-card">
        <div className="section-heading">
          <div>
            <h2>Historial</h2>
            <p>Movimientos registrados para esta tarea.</p>
          </div>
        </div>
        {history.length === 0 ? (
          <p>No hay movimientos registrados.</p>
        ) : (
          <ol className="timeline">
            {history.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.accion}</strong>
                <span>{formatDate(entry.fechaHora)}</span>
                <pre>{JSON.stringify({ anterior: entry.valorAnterior, nuevo: entry.valorNuevo }, null, 2)}</pre>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
