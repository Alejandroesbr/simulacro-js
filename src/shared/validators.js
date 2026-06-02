// email(), required()

export function required(message = "This field is required") {
  return (value) => {
    if (value === null || value === undefined) return message;
    if (typeof value === "string" && value.trim() === "") return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return null;
  };
}

export function email(message = "Enter a valid email address") {
  return (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value).trim()) ? null : message;
  };
}

export function minLength(length, message = `Must have at least ${length} characters`) {
  return (value) => {
    if (!value) return null;
    return String(value).trim().length >= length ? null : message;
  };
}

export function maxLength(length, message = `Must have ${length} characters or less`) {
  return (value) => {
    if (!value) return null;
    return String(value).trim().length <= length ? null : message;
  };
}

export function oneOf(allowedValues, message = "Invalid option") {
  return (value) => {
    return allowedValues.includes(value) ? null : message;
  };
}
