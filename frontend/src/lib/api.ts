// API Configuration and utilities

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Safely parse API response with proper error handling
 * Handles cases where the backend returns HTML instead of JSON (e.g., 404 pages)
 */
export const parseApiResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    
    // Check if the response is JSON
    if (!contentType || !contentType.includes("application/json")) {
        // If we get HTML back, it likely means the API endpoint doesn't exist
        const text = await response.text();
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            throw new Error(
                "Backend API is not available. Please ensure the VITE_API_URL environment variable is configured correctly."
            );
        }
        throw new Error("Unexpected response format from server");
    }
    
    const data = await response.json();
    return data;
};

/**
 * Make a GET request to the API
 */
export const apiGet = async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return parseApiResponse(response);
};

/**
 * Make a POST request to the API with JSON body
 */
export const apiPost = async (endpoint: string, body: unknown) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return parseApiResponse(response);
};

/**
 * Make a POST request to the API with FormData body
 */
export const apiPostFormData = async (endpoint: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
    });
    return parseApiResponse(response);
};
