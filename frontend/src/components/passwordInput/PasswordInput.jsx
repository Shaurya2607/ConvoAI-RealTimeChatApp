import { useState } from "react";
import "./PasswordInput.css";

function PasswordInput({
  label,
  id,
  name,
  placeholder = "",
  value,
  onChange,
  register,
  rules,
  error,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-group">
      {label && (
        <label htmlFor={id || name}>
          {label}
        </label>
      )}

      <div className="password-wrapper">
        <input
          id={id || name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...(register ? register(name, rules) : {})}
        />

        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={
              showPassword
                ? "bi bi-eye-slash"
                : "bi bi-eye"
            }
          ></i>
        </button>
      </div>

      {error && (
        <small className="error">
          {error.message}
        </small>
      )}
    </div>
  );
}

export default PasswordInput;