import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  Input,
  PasswordInput,
  Logo,
} from "../../components";

import { registerUser } from "../../services/authService";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(response.message);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Card>
        <Logo />

        <h2 className="register-title">
          Create Account 🚀
        </h2>

        <p className="register-subtitle">
          Join ConvoAI today
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            register={register}
            name="name"
            rules={{
              required: "Name is required",
            }}
            error={errors.name}
          />

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
                message: "Invalid Email",
              },
            }}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            register={register}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            }}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            register={register}
            name="confirmPassword"
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Register
          </Button>

        </form>

        <div className="register-footer">
          <span>Already have an account?</span>

          <Link to="/">
            Login
          </Link>
        </div>

      </Card>
    </div>
  );
}

export default Register;