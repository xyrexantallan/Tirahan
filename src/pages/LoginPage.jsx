import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { Alert, PasswordField, SubmitButton, TextField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useForm from '../utils/useForm.js';
import { validators } from '../utils/validators.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const form = useForm({ email: '', password: '' }, () => ({
    email: validators.email,
    password: validators.required('your password'),
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.check()) return;
    setSubmitting(true);
    try {
      await login({ email: form.values.email.trim(), password: form.values.password });
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the account your landlord or admin set up for you."
      footer={<>New to Tirahan? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}</Alert>
        <TextField label="Email" type="email" autoComplete="email" autoFocus {...form.bind('email')} />
        <PasswordField label="Password" autoComplete="current-password" {...form.bind('password')} />
        <div className="form-row-end"><Link to="/forgot-password">Forgot password?</Link></div>
        <SubmitButton loading={submitting} loadingText="Signing in…">Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
