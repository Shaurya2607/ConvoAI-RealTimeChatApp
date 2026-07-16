import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  Input,
  PasswordInput,
  Logo,
} from "../../components";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../features/auth/context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      login(response.user, response.token);

      toast.success("Login Successful");

      navigate("/home");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card>
        <Logo />

        <h2 className="login-title">Welcome Back 👋</h2>

        <p className="login-subtitle">
          Login to continue to ConvoAI
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            }}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            register={register}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            }}
            error={errors.password}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>

        </form>

        <div className="login-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Register
          </Link>

        </div>
      </Card>
    </div>
  );
}

export default Login;