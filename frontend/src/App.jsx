import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksListPage from "./pages/TasksListPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskFormPage from "./pages/TaskFormPage";
import SummaryPage from "./pages/SummaryPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/tareas" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tareas" element={<TasksListPage />} />
          <Route path="/tareas/:id" element={<TaskDetailPage />} />
          <Route path="/tareas/:id/editar" element={<TaskFormPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin", "lider"]} />}>
          <Route path="/tareas/nueva" element={<TaskFormPage />} />
          <Route path="/resumen" element={<SummaryPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
