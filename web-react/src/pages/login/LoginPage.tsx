import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 5;
  const isFormValid = email !== '' && isEmailValid && password !== '' && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (isFormValid) {
      const success = await login(email, password);
      if (success) {
        navigate('/home');
      } else {
        setErrorMessage('Invalid email or password');
      }
    }
  };

  return (
    <div className="main-container">
      <Card className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <FloatLabel>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>
          <FloatLabel>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
          <Button type="submit">
            <div className="btn">Login</div>
          </Button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Card>
    </div>
  );
}
