import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { useAuth } from "../auth/AuthContext";

type FormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage("");
    const ok = await login(values.email, values.password);
    if (ok) {
      navigate("/home");
    } else {
      setErrorMessage("Invalid email or password");
    }
  });

  return (
    <div className="main-container-login">
      <Card className="login-card-wrap" title="Login">
        <form className="login-form" onSubmit={onSubmit}>
          <FloatLabel>
            <InputText
              id="email"
              type="email"
              className="w-full"
              invalid={!!errors.email}
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>
          <FloatLabel>
            <InputText
              id="password"
              type="password"
              className="w-full"
              invalid={!!errors.password}
              {...register("password", { required: true, minLength: 5 })}
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
          <Button type="submit" label="Login" className="w-full" />
        </form>
        {errorMessage ? (
          <div className="login-error">{errorMessage}</div>
        ) : null}
      </Card>
    </div>
  );
}
