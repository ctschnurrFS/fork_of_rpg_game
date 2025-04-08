"use client";
import { useState } from "react";

export function useCallGemini() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responseText, setResponseText] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const queryGemini = async (message: string) => {

        setLoading(true);
        setError(null);

        try {

            // Call Gemini Text API
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("The Gemini AI Response Failed");

            const data = await response.json();
            setResponseText(data.text);            

            // Call Gemini Image API
            const imageResponse = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message }),
            });

            if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                setImageUrl(URL.createObjectURL(blob));
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { queryGemini, responseText, imageUrl, loading, error };
}  
           
           