"use client";
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export function useGemini() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string | null>(null);
    //const [imageUrl, setImageUrl] = useState<string | null>(null);

    const queryGemini = async (message: string): Promise<string> => {
    //const queryGemini = async (message: string): Promise<{ html: string; imageUrl: string | null }> => {

        setLoading(true);
        setError(null);
        //setImageUrl(null);
        setPrompt(message);
        const originalMessage = message;

        message = "please give a response to this prompt knowing that this prompt is part of an rpg game set in a fantasy world with characters and landscapes like in lord of the rings. And please limit your answer to 100 words or less. Here is the response prompt: " + message;

        try {
            const response = await ai.models.generateContent({
                // model: "gemini-2.0-flash",
                // contents: message,
                model: 'gemini-2.0-flash-exp-image-generation',
                contents: message,
                config: {
                    responseModalities: ['Text', 'Image']
                },
            });

            ///////////////////////////////////////////////////////

            const responseImage = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: originalMessage }),
            });
           
            // let imageHTML;
            let returnHtml = "<div style = 'display: flex; align-items: center; gap: 20px;' ><div style='max-width: 900px; font-size: 14px;'>"
            returnHtml += "<p>" + response.text + "</p>" + "</div>";            

            if (responseImage) {

                const blob = await responseImage.blob();
                const imageUrl = URL.createObjectURL(blob);

                returnHtml +=  `<img src='${imageUrl}' alt='Generated'  style='height: 375px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: contrast(90%) brightness(90%);border-radius: 8px;' />`;             
            } else {
                console.log("Failed to generate image");
            }       

            returnHtml += "</div>";

            return returnHtml;

        } catch (err: any) {
            setError(err.message);
            return `Error: ${err.message}`;
        } finally {
            setLoading(false);
        }
    };

    return { queryGemini, loading, error };
}
