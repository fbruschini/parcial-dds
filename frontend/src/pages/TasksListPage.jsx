import { useEffect, useState } from "react";
import { fetchTasks } from "../api/tareas";
import { fetchProjects } from "../api/proyectos";
import { fetchUsers } from "../api/usuarios";
import { getErrorMessage } from "../api/client";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";

const DEFAULT_FILTERS = {
  proyectoId: "",
  responsableId: "",
  estado: "",
  prioridad: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: 10,
};

export default function TasksListPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [tasksResponse, setTasksResponse] = useState({ data: [], pagination: null });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [projectsData, usersData] = await Promise.all([fetchProjects(), fetchUsers()]);
        setProjects(projectsData);
        setUsers(usersData);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      }
    }

    loadCatalogs();
  }, []);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTasks(appliedFilters);
        setTasksResponse(data);
      } catch (apiError) {
        setError(getErrorMessage(apiError));
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [appliedFilters]);

  function handleSubmit(event) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  }

  function changePage(nextPage) {
    const nextFilters = { ...filters, page: nextPage };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Listado de tareas</h1>
          <p>Filtros, paginacion y ordenamiento resueltos desde la API.</p>
        </div>
      </div>
      <div className="tasks-layout">
        <aside className="filters-sidebar">
          <TaskFilters
            filters={filters}
            projects={projects}
            users={users}
            onChange={setFilters}
            onSubmit={handleSubmit}
            onReset={resetFilters}
          />
        </aside>
        <section className="tasks-content">
          <ErrorMessage message={error} />
          {loading ? <LoadingMessage /> : <TaskTable tasks={tasksResponse.data} />}
          {tasksResponse.pagination && (
            <div className="pagination">
              <button
                type="button"
                className="secondary"
                disabled={tasksResponse.pagination.page <= 1}
                onClick={() => changePage(tasksResponse.pagination.page - 1)}
              >
                Anterior
              </button>
              <span>
                Pagina {tasksResponse.pagination.page} de {tasksResponse.pagination.totalPages} ·{" "}
                {tasksResponse.pagination.total} tareas
              </span>
              <button
                type="button"
                className="secondary"
                disabled={tasksResponse.pagination.page >= tasksResponse.pagination.totalPages}
                onClick={() => changePage(tasksResponse.pagination.page + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
