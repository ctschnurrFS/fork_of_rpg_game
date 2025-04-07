"use client";

import { useCallGemini } from "@/lib/useCallGemini";
import { useEffect } from "react"; // Import useEffect

// Define the props for the component
interface GeminiComponentProps {
    promptText: string; // The text input received from the parent
}

// Update the component to accept props
export default function GeminiComponent({ promptText }: GeminiComponentProps) {
    // useGemini hook remains the same
    const { queryGemini, responseText, imageUrl, loading, error } = useCallGemini();

    // Use useEffect to call queryGemini when the promptText prop changes
    useEffect(() => {
        // Only query if promptText has a meaningful value
        if (promptText && promptText.trim()) {
            // Call the query function with the text from the prop
            queryGemini(promptText);
        }
        // Add promptText and queryGemini as dependencies
        // The effect will re-run if either of these change.
        // Assuming queryGemini is stable from useGemini hook (e.g., wrapped in useCallback)
    }, [promptText, queryGemini]);

    return (
        <div className="p-4">
            {/* Keep the display logic for loading, error, response text, and image */}
            {loading && <p className="text-blue-500">Processing prompt...</p>} {/* You might want a loading indicator */}
            
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {responseText && (
                <div className="mt-4 p-2 border rounded bg-gray-100">
                    <p>{responseText}</p>
                </div>
            )}

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Generated image based on prompt"
                    className="mt-4 border rounded"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            )}
        </div>
    );
}