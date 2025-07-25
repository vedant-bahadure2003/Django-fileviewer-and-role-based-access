// lib/api.ts
// ✅ API base URL for Django backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// ✅ Function to get auth token with multiple fallback options
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("token") ||
    null
  );
};

// ✅ Function to clear all stored tokens
const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("token");
};

// ✅ Generic API request function with enhanced error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // ✅ Get the token from storage
  const token = getAuthToken();

  // ✅ Make sure headers is a plain object to avoid TS error
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // ✅ Attach Authorization token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const defaultOptions: RequestInit = {
    method: "GET",
    credentials: "include", // ✅ send cookies if backend needs it
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // ✅ Handle different HTTP status codes
    if (response.status === 401) {
      // Unauthorized - clear tokens and throw specific error
      clearAuthTokens();
      throw new Error("Authentication failed. Please log in again.");
    }

    if (response.status === 403) {
      // Forbidden - user doesn't have permission
      throw new Error(
        "Access forbidden. You do not have permission to perform this action."
      );
    }

    if (response.status === 404) {
      throw new Error("Resource not found.");
    }

    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    // ✅ Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }
      // If response is ok but not JSON, return empty object
      data = {};
    }

    if (!response.ok) {
      const errorMsg =
        data.message ||
        data.detail ||
        data.error ||
        (typeof data === "string" ? data : JSON.stringify(data)) ||
        `API request failed: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);

    // ✅ Re-throw the error so components can handle it
    if (error instanceof Error) {
      throw error;
    }

    // ✅ Handle network errors or other non-Error objects
    throw new Error("Network error occurred. Please check your connection.");
  }
};

// ✅ Authentication API with better error handling
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await apiRequest("/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // ✅ Store token after successful login
      if (response.token || response.access_token) {
        const token = response.token || response.access_token;
        localStorage.setItem("token", token);
      }

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiRequest("/logout/", {
        method: "POST",
      });

      // ✅ Clear tokens after successful logout
      clearAuthTokens();

      return response;
    } catch (error) {
      // ✅ Clear tokens even if logout request fails
      clearAuthTokens();
      console.error("Logout error:", error);
      throw error;
    }
  },

  getUser: async () => {
    return apiRequest("/user/");
  },

  checkAuth: async () => {
    try {
      return await apiRequest("/check-auth/");
    } catch (error) {
      // ✅ If auth check fails, clear tokens
      if (error instanceof Error && error.message.includes("Authentication")) {
        clearAuthTokens();
      }
      throw error;
    }
  },
};

// ✅ Files API with better error handling
export const filesAPI = {
  listFiles: async () => {
    try {
      return await apiRequest("/files/");
    } catch (error) {
      console.error("Failed to fetch files:", error);
      throw error;
    }
  },

  checkFile: async (filename: string) => {
    if (!filename) {
      throw new Error("Filename is required");
    }

    try {
      return await apiRequest(`/files/check/${encodeURIComponent(filename)}/`);
    } catch (error) {
      console.error(`Failed to check file ${filename}:`, error);
      throw error;
    }
  },

  downloadFile: async (filename: string) => {
    if (!filename) {
      throw new Error("Filename is required");
    }

    try {
      // ✅ For file downloads, we might need to handle binary data differently
      const token = getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/files/download/${encodeURIComponent(filename)}/`,
        {
          method: "GET",
          credentials: "include",
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthTokens();
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }

      return response; // Return the response object for blob handling
    } catch (error) {
      console.error(`Failed to download file ${filename}:`, error);
      throw error;
    }
  },

  openFile: async (filename: string) => {
    if (!filename) {
      throw new Error("Filename is required");
    }

    try {
      return await apiRequest(`/files/open/${encodeURIComponent(filename)}/`);
    } catch (error) {
      console.error(`Failed to open file ${filename}:`, error);
      throw error;
    }
  },

  getActivityLogs: async () => {
    try {
      return await apiRequest("/activity-logs/");
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      throw error;
    }
  },
};

// ✅ Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

// ✅ Helper function to manually clear authentication
export const clearAuthentication = (): void => {
  clearAuthTokens();
};

// ✅ Export the core apiRequest function for custom usage
export { apiRequest };
