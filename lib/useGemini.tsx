"use client";
import { useState } from "react";
import { z } from 'zod';

export function useGemini() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responseText, setResponseText] = useState<string | null>(null);

    // Schema for game input (e.g., "walk north", "ask how are you")
    const gameInputSchema = z
        .string()
        .min(1, { message: 'Input cannot be empty' }) // Non-empty
        .max(500, { message: 'Input is too long (max 500 characters)' }) // Max length
        .trim() // Remove leading/trailing whitespace
        .regex(/^[a-zA-Z0-9\s?!,.']*$/, { message: 'Input contains invalid characters' }) // Allowed characters
        .transform((val) => val.toLowerCase()); // Normalize to lowercase

    const queryGemini = async (message: string, npc: string): Promise<string> => {

        setLoading(true);
        setError(null);
        setResponseText(null);
        let sendPrompt;

        const result = gameInputSchema.safeParse(message);

        if (!result.success) {
            console.log("validation error");            
        }
        else {
            sendPrompt = result.data;
        }

        sendPrompt = "Please give a response to this prompt knowing that it is part of an rpg game set in a fantasy world with characters and landscapes like in lord of the rings. And please limit your answer to 150 words or less. Here are the npc character details: " + npc + " and here is the question for them to answer: " +  sendPrompt;
        
        try {

            // Call Gemini Text API
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: sendPrompt }),
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            setResponseText(data.text);  

            return data.text;

         } catch (err: unknown) { 
                let errorMessage = "An unknown error occurred";
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                setError(errorMessage);
                return "";
            } finally {
            setLoading(false);
        }  
    };

    return { queryGemini, responseText, loading, error };
}                   

            // const data = await response.json();
            // const aiText: string = data.text; // Or simply: const aiText = data.text;

            // return aiText;

            // const response = await ai.models.generateContent({
            //     // model: "gemini-2.0-flash",
            //     // contents: message,
            //     model: 'gemini-2.0-flash-exp-image-generation',
            //     contents: message,
            //     config: {
            //         responseModalities: ['Text', 'Image']
            //     },
            // });

            ///////////////////////////////////////////////////////

            // const responseImage = await fetch("/api/generate-image", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ prompt: messageImage }),
            // });
           
            // // let imageHTML;
            // let returnHtml = "<div style = 'display: flex; align-items: center; gap: 20px;' ><div style='max-width: 900px; font-size: 14px;'>"
            // returnHtml += "<p>" + response.text + "</p>" + "</div>";            

            // if (responseImage) {

            //     const blob = await responseImage.blob();
            //     const imageUrl = URL.createObjectURL(blob);

            //     returnHtml +=  `<img src='${imageUrl}' alt='Generated'  style='height: 375px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: contrast(90%) brightness(90%);border-radius: 8px;' />`;             
            // } else {
            //     console.log("Failed to generate image");
            // }       

            // console.log(" response.text:  " +  response.text);
            // console.log(" response.tet:  " +  response);
            // let returnHtml = "<div>" + response.text + "</div>";
            // //returnHtml += "</div>";

            // return returnHtml;

//         } catch (err: any) {
//             setError(err.message);
//             return `Error: ${err.message}`;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { queryGemini, loading, error };
// }
