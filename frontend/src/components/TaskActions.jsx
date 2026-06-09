import { useState } from "react";
import { changeTaskState } from "../api/tareas";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ErrorMessage, SuccessMessage } from "./StatusMessage";

export default function TaskActions({ task, onChanged }) {
  const { user, isAdminLike } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isOwner = task.responsableId === user?.id;
  const canCollaboratorMove = isOwner && !["finalizada", "cancelada"].includes(task.estado);
  const canAdminMove = isAdminLike && !["finalizada", "cancelada"].includes(task.estado);

  async function runAction(action) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updated = await changeTaskState(task.id, action);
      setSuccess("Estado actualizado correctamente");
      onChanged(updated);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Acciones de estado</h2>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      <div className="actions-row">
        {(canCollaboratorMove || canAdminMove) && (
          <>
            <button type="button" disabled={loading} onClick={() => runAction("iniciar")}>
              Iniciar
            </button>
            <button type="button" disabled={loading} onClick={() => runAction("bloquear")}>
              Bloquear
            </button>
          </>
        )}
        {canAdminMove && (
          <>
            <button type="button" disabled={loading} onClick={() => runAction("finalizar")}>
              Finalizar
            </button>
            <button type="button" className="danger" disabled={loading} onClick={() => runAction("cancelar")}>
              Cancelar
            </button>
          </>
        )}
      </div>
      {!canCollaboratorMove && !canAdminMove && <p>No hay acciones disponibles para esta tarea.</p>}
    </section>
  );
}
