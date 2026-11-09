import { useId, useState } from 'react';
import { passwordStrength } from '../utils/validators.js';

export function FormField({ label, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label">{label}</label>
      {children}
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function TextField({ label, name, error, hint, ...input }) {
  const id = useId();
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input id={id} name={name} className="input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-e` : undefined} {...input} />
      {error ? <p className="field-error" id={`${id}-e`} role="alert">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function SelectField({ label, name, error, hint, options, ...input }) {
  const id = useId();
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      <select id={id} name={name} className="input" aria-invalid={Boolean(error)} {...input}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function PasswordField({ label, name, error, hint, showStrength, value, ...input }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(value || '') : null;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} name={name} value={value} type={visible ? 'text' : 'password'} className="input" aria-invalid={Boolean(error)} {...input} />
        <button type="button" className="input-toggle" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {showStrength && value ? (
        <div className="strength" aria-live="polite">
          <span className={`strength-bar s${strength.score}`}><i /><i /><i /><i /></span>
          <span className="strength-label">{strength.label}</span>
        </div>
      ) : null}
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function SubmitButton({ loading, loadingText, children, ...rest }) {
  return (
    <button type="submit" className="btn btn-primary btn-block" disabled={loading} {...rest}>
      {loading ? loadingText : children}
    </button>
  );
}
