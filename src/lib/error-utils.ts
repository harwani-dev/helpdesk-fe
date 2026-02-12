/**
 * Safely extracts an error message from an API error response
 * Handles cases where the error could be a string or an object with nested properties
 * 
 * @param error - The error object from the API call
 * @param fallbackMessage - Default message if no error message can be extracted
 * @returns A string error message safe for display
 */
export function extractErrorMessage(error: any, fallbackMessage: string = "An error occurred"): string {
    // Try to get error from response.data.error
    if (error?.response?.data?.error) {
        const errorData = error.response.data.error

        // If it's a string, return it directly
        if (typeof errorData === 'string') {
            return errorData
        }

        // If it's an object, try to extract meaningful fields
        if (typeof errorData === 'object') {
            // Try common error object patterns
            if (errorData.details) {
                // Handle array of details (validation errors)
                if (Array.isArray(errorData.details)) {
                    return errorData.details[0] || fallbackMessage
                }
                // Handle string details
                if (typeof errorData.details === 'string') {
                    return errorData.details
                }
            }

            // Try other common fields
            if (errorData.message && typeof errorData.message === 'string') {
                return errorData.message
            }

            if (errorData.code && typeof errorData.code === 'string') {
                return errorData.code
            }

            // Last resort: stringify the object
            return JSON.stringify(errorData)
        }
    }

    // Try error.message as fallback
    if (error?.message && typeof error.message === 'string') {
        return error.message
    }

    // Return the fallback message
    return fallbackMessage
}
