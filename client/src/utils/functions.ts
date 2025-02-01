const API_URL = "http://127.0.0.1:8000";
const csrfToken = getCSRFToken(); // Get the CSRF token

export async function customFetch(endpoint:string, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options as any).headers,
      "Content-Type": "application/json",
      'X-CSRFToken': csrfToken,  // Send CSRF token in headers
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

// Function to get CSRF token from cookies
function getCSRFToken() {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'csrftoken') {
        return value;
      }
    }
    return null;
  }
  
