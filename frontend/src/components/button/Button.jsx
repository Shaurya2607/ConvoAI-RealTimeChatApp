import "./Button.css";
import Loader from "../loader/Loader";

function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
}) {
  return (
    <button
      type={type}
      className={`custom-btn ${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Loader /> : children}
    </button>
  );
}

export default Button;