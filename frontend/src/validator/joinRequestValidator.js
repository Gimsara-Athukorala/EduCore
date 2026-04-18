export const validateJoinRequest = ({ fullName, email, studentId, message }) => {
  const errors = {};

  const trimmedName = String(fullName || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedStudentId = String(studentId || '').trim();
  const trimmedMessage = String(message || '').trim();

  if (!trimmedName) {
    errors.fullName = 'Full name is required';
  } else if (trimmedName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }

  if (!trimmedEmail) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!trimmedStudentId) {
    errors.studentId = 'Student ID is required';
  } else if (trimmedStudentId.length < 3) {
    errors.studentId = 'Student ID must be at least 3 characters';
  }

  if (!trimmedMessage) {
    errors.message = 'Why do you want to join? is required';
  } else if (trimmedMessage.length < 20) {
    errors.message = 'Please provide at least 20 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
