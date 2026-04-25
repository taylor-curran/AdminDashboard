import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";

interface LoginFormValues {
  email: string;
  password: string;
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage("");
    const success = await login(values.email, values.password);
    if (success) {
      navigate("/home");
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-main-container">
      <Card className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FloatLabel>
            <InputText
              id="email"
              type="email"
              {...register("email", {
                required: true,
                pattern: EMAIL_RE,
              })}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>
          <FloatLabel>
            <InputText
              id="password"
              type="password"
              {...register("password", {
                required: true,
                minLength: 5,
              })}
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
          <Button type="submit" disabled={formState.isSubmitting}>
            <div className="btn">Login</div>
          </Button>
        </form>
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
      </Card>
    </div>
  );
}
