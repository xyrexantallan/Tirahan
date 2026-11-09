// Shared form validation. Each validator returns an error string or ''.
export const validators = {
  fullName: (v) => {
    const s = v.trim();
    if (!s) return 'Enter your full name.';
    if (s.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(s)) return 'Use letters, spaces, periods, hyphens or apostrophes only.';
    return '';
  },
  email: (v) => {
    const s = v.trim();
    if (!s) return 'Enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Enter a valid email, like name@example.com.';
    return '';
  },
  // Philippine mobile: 09XXXXXXXXX or +639XXXXXXXXX
  phone: (v) => {
    const s = v.replace(/[\s-]/g, '');
    if (!s) return 'Enter your mobile number.';
    if (!/^(09|\+639)\d{9}$/.test(s)) return 'Use a PH mobile number, like 0917 123 4567.';
    return '';
  },
  password: (v) => {
    if (!v) return 'Enter a password.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.';
    return '';
  },
  required: (label) => (v) => (v ? '' : `Enter ${label}.`),
  confirm: (other) => (v) => {
    if (!v) return 'Re-enter the password.';
    if (v !== other) return 'Passwords do not match.';
    return '';
  },
  role: (v) => (['ADMIN', 'STAFF'].includes(v) ? '' : 'Choose a role.'),
};

export function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
  return { score: Math.min(score, 4), label: pw ? labels[score] : '' };
}

export function runValidation(values, rules) {
  const errors = {};
  for (const key of Object.keys(rules)) {
    const msg = rules[key](values[key] ?? '');
    if (msg) errors[key] = msg;
  }
  return errors;
}
