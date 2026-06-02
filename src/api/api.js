export const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("API is not available. Check that json-server is running.");
  }

  if (!response.ok) {
    const error = await parseResponse(response);
    throw new Error(error?.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return parseResponse(response);
}

async function parseResponse(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function get(path) {
  return request(path);
}

export function post(path, data) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function patch(path, data) {
  return request(path, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function remove(path) {
  return request(path, {
    method: "DELETE",
  });
}
