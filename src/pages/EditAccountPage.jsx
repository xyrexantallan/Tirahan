import { useState } from 'react';
import { Alert, PasswordField, SubmitButton, TextField } from '../components/FormField.jsx';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import useForm from '../utils/useForm.js';
import { validators } from '../utils/validators.js';

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  const form = useForm({ fullName: user.fullName, email: user.email, phone: user.phone }, () => ({
    fullName: validators.fullName,
    email: validators.email,
    phone: validators.phone,
  }));
  const unchanged = ['fullName', 'email', 'phone'].every((k) => form.values[k].trim() === user[k]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaved(false);
    if (!form.check()) return;
    setSubmitting(true);
    try {
      const { fullName, email, phone } = form.values;
      const u = await updateProfile({ fullName, email: email.trim(), phone });
      form.reset({ fullName: u.fullName, email: u.email, phone: u.phone });
      setSaved(true);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) form.setServerErrors(err.fieldErrors);
      else setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Profile</h2>
      <p className="panel-sub">Your name and contact details appear in the audit log and on records you create.</p>
      <form onSubmit={handleSubmit} noValidate onChange={() => setSaved(false)}>
        <Alert>{formError}</Alert>
        <Alert type="success">{saved && 'Changes saved.'}</Alert>
        <TextField label="Full name" autoComplete="name" {...form.bind('fullName')} />
        <div className="grid-2">
          <TextField label="Email" type="email" autoComplete="email" {...form.bind('email')} />
          <TextField label="Mobile number" type="tel" autoComplete="tel" {...form.bind('phone')} />
        </div>
        <div className="field">
          <span className="field-label">Role</span>
          <p className="readonly">{user.role === 'ADMIN' ? 'Admin (landlord)' : 'Staff'}</p>
          <p className="field-hint">Only an admin can change roles.</p>
        </div>
        <div className="actions">
          <SubmitButton loading={submitting} loadingText="Saving…" disabled={unchanged || submitting}>Save changes</SubmitButton>
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  const form = useForm({ currentPassword: '', newPassword: '', confirm: '' }, (v) => ({
    currentPassword: validators.required('your current password'),
    newPassword: (val) => validators.password(val) || (val === v.currentPassword ? 'New password must be different from the current one.' : ''),
    confirm: validators.confirm(v.newPassword),
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaved(false);
    if (!form.check()) return;
    setSubmitting(true);
    try {
      await authApi.changePassword({ currentPassword: form.values.currentPassword, newPassword: form.values.newPassword });
      form.reset();
      setSaved(true);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) form.setServerErrors(err.fieldErrors);
      else setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Change password</h2>
      <p className="panel-sub">Choose a password you don't use anywhere else.</p>
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}</Alert>
        <Alert type="success">{saved && 'Password updated.'}</Alert>
        <PasswordField label="Current password" autoComplete="current-password" {...form.bind('currentPassword')} />
        <PasswordField label="New password" autoComplete="new-password" showStrength hint="At least 8 characters, with a letter and a number." {...form.bind('newPassword')} />
        <PasswordField label="Confirm new password" autoComplete="new-password" {...form.bind('confirm')} />
        <div className="actions">
          <SubmitButton loading={submitting} loadingText="Updating…">Update password</SubmitButton>
        </div>
      </form>
    </section>
  );
}

export default function EditAccountPage() {
  return (
    <div className="page">
      <h1 className="page-title">My account</h1>
      <div className="stack">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}
