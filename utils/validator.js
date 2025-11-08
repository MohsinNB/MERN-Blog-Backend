export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least one uppercase letter is required");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter is required");
  }
  if (!/\d/.test(password)) {
    errors.push("At least one number is required");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("At least one special character (@$!%*?&) is required");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, message: "Password is strong!" };
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }
  return { valid: true };
};
