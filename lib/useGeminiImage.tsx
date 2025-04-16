"use client";
import { useState } from "react";
import { z } from 'zod';

export function useGeminiImage() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

        // Schema for game input (e.g., "walk north", "ask how are you")
        const gameInputSchema = z
        .string()
        .min(1, { message: 'Input cannot be empty' }) // Non-empty
        .max(500, { message: 'Input is too long (max 500 characters)' }) // Max length
        .trim() // Remove leading/trailing whitespace
        .regex(/^[a-zA-Z0-9\s?!,.']*$/, { message: 'Input contains invalid characters' }) // Allowed characters
        .transform((val) => val.toLowerCase()); // Normalize to lowercase

    const queryGeminiImage = async (message: string) => {

        setLoading(true);
        setError(null);
        let sendPrompt;

        const result = gameInputSchema.safeParse(message);

        if (!result.success) {
            console.log("validation error");            
        }
        else {
            sendPrompt = result.data;
        }

        try {        

            console.log("asdfasdf    " + sendPrompt);

            // Call Gemini Image API
            const imageResponse = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: sendPrompt }),
            });

            let returnHtml = ""; // = "<div style = 'display: flex; align-items: center; gap: 20px;' ><div style='max-width: 900px; font-size: 14px;'>"
            //returnHtml += "<p>" + response.text + "</p>" + "</div>";            

            if (imageResponse) {

                const blob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageUrl(imageUrl);

                //returnHtml +=  `<img src='${imageUrl}' alt='Generated'  style='height: 375px; border: 6px groove #8B795E; padding: 4px; box-sizing: border-box; display: block; max-width: 100%; height: auto;' />`;             
                returnHtml +=  `<img src='${imageUrl}' alt='Generated'  style='height: 375px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: contrast(90%) brightness(90%);border-radius: 8px;' />`;             
            } else {
                console.log("Failed to generate image");
            } 

            return returnHtml;

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { queryGeminiImage, imageUrl, loading, error };
}  
           
           