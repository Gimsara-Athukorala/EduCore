export const validateAdminLogin = ({ email, password }) => {
  const errors = {};

  if (!String(email || '').trim()) {
    errors.email = 'Email is required';
  }

  if (!String(password || '').trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};