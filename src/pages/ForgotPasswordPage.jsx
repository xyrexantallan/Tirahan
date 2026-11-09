import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { Alert, SubmitButton, TextField } from '../components/FormField.jsx';
import { authApi, isMockMode } from '../api/authApi.js';
import useForm from '../utils/useForm.js';
import { validators } from '../utils/validators.js';

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(null); // { email, devResetLink? }

  const form = useForm({ email: '' }, () => ({ email: validators.email }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.check()) return;
    setSubmitting(true);
    try {
      const email = form.values.email.trim();
      const res = await authApi.forgotPassword(email);
      setSent({ email, devResetLink: res.devResetLink });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" footer={<Link to="/login">Back to sign in</Link>}>
        <Alert type="success">
          If an account exists for <strong>{sent.email}</strong>, we've sent a link to reset the password. The link expires in 15 minutes.
        </Alert>
        {isMockMode && sent.devResetLink && (
          <div className="dev-note">
            <p><strong>Demo mode:</strong> no email is sent, so here is the reset link.</p>
            <Link to={sent.devResetLink.replace(window.location.origin, '')} className="btn btn-secondary btn-block">Open reset link</Link>
          </div>
        )}
        <button type="button" className="btn btn-ghost btn-block" onClick={() => setSent(null)}>Use a different email</button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a reset link."
      footer={<Link to="/login">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}</Alert>
        <TextField label="Email" type="email" autoComplete="email" autoFocus {...form.bind('email')} />
        <SubmitButton loading={submitting} loadingText="Sending link…">Send reset link</SubmitButton>
      </form>
    </AuthLayout>
  );
}
