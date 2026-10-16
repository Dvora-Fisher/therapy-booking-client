/**
 * Turns an axios error into one Hebrew sentence for the user.
 * The server always answers with ProblemDetails: { title, status, detail, errors?, alternatives? }.
 */
export function getErrorMessage(error, fallback = 'משהו השתבש. נסו שוב בעוד רגע.') {
  if (!error?.response) {
    return 'אין חיבור לשרת. בדקו את החיבור לאינטרנט ונסו שוב.';
  }

  const problem = error.response.data ?? {};

  // Validation errors (400 from [ApiController]): { errors: { Email: ["..."] } } - show the first one
  const firstValidationMessage = problem.errors && Object.values(problem.errors).flat()[0];

  return problem.detail || firstValidationMessage || fallback;
}

/** Field-level validation messages, keyed by camelCase field name: { email: "...", password: "..." } */
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors ?? {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field.charAt(0).toLowerCase() + field.slice(1), messages[0]]),
  );
}
