import { useState } from 'react';
import { runValidation } from './validators.js';

// Small form helper: values, per-field errors (shown after blur or submit), and a submit wrapper.
export default function useForm(initial, getRules) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (v = values) => runValidation(v, getRules(v));

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, ...pick(validate(next), [name, ...dependents(name)], touched) }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate()[name] || '' }));
  }

  // Returns true when valid; otherwise surfaces all errors.
  function check() {
    const found = validate();
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    return Object.keys(found).length === 0;
  }

  const setServerErrors = (fieldErrors) => setErrors((prev) => ({ ...prev, ...fieldErrors }));
  const reset = (next = initial) => { setValues(next); setErrors({}); setTouched({}); };

  const bind = (name) => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur, error: errors[name] });
  return { values, setValues, errors, bind, check, setServerErrors, reset };
}

// Changing "password" should re-check "confirm", and so on.
const dependents = (name) => ({ password: ['confirm'], newPassword: ['confirm'] }[name] || []);
const pick = (all, keys, touched) => Object.fromEntries(keys.filter((k) => touched[k] || k === keys[0]).map((k) => [k, all[k] || '']));
