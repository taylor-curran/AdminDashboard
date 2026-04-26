import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

type FormValues = { email: string; password: string };

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onSubmit" });

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage("");
    const ok = await login(data.email, data.password);
    if (ok) navigate("/home");
    else setErrorMessage("Invalid email or password");
  });

  return (
    <div className="login-main-container">
      <Card className="login-card">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <span className="p-float-label login-field">
            <InputText
              id="email"
              type="email"
              className={errors.email ? "p-invalid" : ""}
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            <label htmlFor="email">Email</label>
          </span>
          <span className="p-float-label login-field">
            <InputText
              id="password"
              type="password"
              className={errors.password ? "p-invalid" : ""}
              {...register("password", { required: true, minLength: 5 })}
            />
            <label htmlFor="password">Password</label>
          </span>
          <Button type="submit" label="Login" className="login-submit" />
        </form>
        {errorMessage ? <div className="login-error">{errorMessage}</div> : null}
      </Card>
    </div>
  );
}
