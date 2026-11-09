import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { Alert, PasswordField, SelectField, SubmitButton, TextField } from '../components/FormField.jsx';
import { authApi } from '../api/authApi.js';
import useForm from '../utils/useForm.js';
import { validators } from '../utils/validators.js';

const ROLE_OPTIONS = [
  { value: 'STAFF', label: 'Staff — meter readings and maintenance' },
  { value: 'ADMIN', label: 'Admin — landlord, full access' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const form = useForm(
    { fullName: '', email: '', phone: '', role: 'STAFF', password: '', confirm: '' },
    (v) => ({
      fullName: validators.fullName,
      email: validators.email,
      phone: validators.phone,
      role: validators.role,
      password: validators.password,
      confirm: validators.confirm(v.password),
    })
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.check()) return;
    setSubmitting(true);
    try {
      const { fullName, email, phone, role, password } = form.values;
      await authApi.register({ fullName, email: email.trim(), phone, role, password });
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) form.setServerErrors(err.fieldErrors);
      else setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="You'll sign in with your email and password."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}</Alert>
        <TextField label="Full name" autoComplete="name" autoFocus {...form.bind('fullName')} />
        <div className="grid-2">
          <TextField label="Email" type="email" autoComplete="email" {...form.bind('email')} />
          <TextField label="Mobile number" type="tel" autoComplete="tel" placeholder="0917 123 4567" {...form.bind('phone')} />
        </div>
        <SelectField label="Role" options={ROLE_OPTIONS} {...form.bind('role')} />
        <PasswordField label="Password" autoComplete="new-password" showStrength hint="At least 8 characters, with a letter and a number." {...form.bind('password')} />
        <PasswordField label="Confirm password" autoComplete="new-password" {...form.bind('confirm')} />
        <SubmitButton loading={submitting} loadingText="Creating account…">Create account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
