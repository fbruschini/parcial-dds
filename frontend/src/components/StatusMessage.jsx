export function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <div className="alert alert-error">{message}</div>;
}

export function SuccessMessage({ message }) {
  if (!message) {
    return null;
  }

  return <div className="alert alert-success">{message}</div>;
}

export function LoadingMessage({ message = "Cargando..." }) {
  return <div className="alert">{message}</div>;
}
