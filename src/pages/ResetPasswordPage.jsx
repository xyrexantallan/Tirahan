import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { Alert, PasswordField, SubmitButton } from '../components/FormField.jsx';
import { authApi } from '../api/authApi.js';
import useForm from '../utils/useForm.js';
import { validators } from '../utils/validators.js';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);

  const form = useForm({ password: '', confirm: '' }, (v) => ({
    password: validators.password,
    confirm: validators.confirm(v.password),
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.check()) return;
    setSubmitting(true);
    try {
      await authApi.resetPassword(token, form.values.password);
      setDone(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Reset link not found" footer={<Link to="/login">Back to sign in</Link>}>
        <Alert>This page needs the link from your reset email. Request a new one to continue.</Alert>
        <Link to="/forgot-password" className="btn btn-primary btn-block">Request a new link</Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated">
        <Alert type="success">Your password has been changed. Sign in with your new password.</Alert>
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/login', { replace: true })}>Go to sign in</button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Pick something you haven't used on Tirahan before." footer={<Link to="/login">Back to sign in</Link>}>
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}{formError.includes('expired') && <> <Link to="/forgot-password">Request a new link</Link></>}</Alert>
        <PasswordField label="New password" autoComplete="new-password" showStrength autoFocus hint="At least 8 characters, with a letter and a number." {...form.bind('password')} />
        <PasswordField label="Confirm new password" autoComplete="new-password" {...form.bind('confirm')} />
        <SubmitButton loading={submitting} loadingText="Saving…">Save new password</SubmitButton>
      </form>
    </AuthLayout>
  );
}
