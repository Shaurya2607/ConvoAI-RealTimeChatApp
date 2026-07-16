import "./Input.css";

function Input({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  register,
  rules,
  error,
  disabled = false,
}) {
  return (
    <div className="input-group-custom">

      {label && (
        <label htmlFor={id || name}>
          {label}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}

        {...(register ? register(name, rules) : {})}
      />

      {error && (
        <small className="error">
          {error.message}
        </small>
      )}

    </div>
  );
}

export default Input;