import { useEffect, useState } from "react";
import { fetchSummary } from "../api/tareas";
import { getErrorMessage } from "../api/client";
import SummaryCards from "../components/SummaryCards";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";

export default function SummaryPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError("");

      try {
        setSummary(await fetchSummary());
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Resumen administrativo</h1>
          <p>Tareas por estado, vencidas, carga por responsable y criticas.</p>
        </div>
      </div>
      <ErrorMessage message={error} />
      {loading && <LoadingMessage />}
      {summary && <SummaryCards summary={summary} />}
    </>
  );
}
