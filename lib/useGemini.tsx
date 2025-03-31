"use client";
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export function useGemini() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const queryGemini = async (message: string): Promise<string> => {

        setLoading(true);
        setError(null);
        setImageUrl(null);
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

            const data = await responseImage.json();
            if (!responseImage.ok) throw new Error(data.error || "Failed to generate image");

            console.log("Image URL:", data.imageUrl);
            setImageUrl(data.imageUrl); // Save image URL in state


            setLoading(false);

            // console.log("imageUrl: " + imageUrl);

            //console.log("imageUrl: " + data.imageUrl);




                // < div style = 'display: flex; align-items: center; gap: 20px;' >
                //     <img src='https://via.placeholder.com/150' alt='Sample Image' style='width: 150px; height: auto; border-radius: 10px;'>
                //         <div style='max-width: 400px; font-size: 18px;'>
                //             <p>This is some text placed next to an image. You can adjust the styling to fit your needs.</p>
                //         </div>
                //     </div>

            //const x = `<img src='${data.imageUrl}' alt='Generated'  style='height: 450px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: sepia(40%) contrast(90%) brightness(90%);border-radius: 8px;' />`;
            const x = `<img src='${data.imageUrl}' alt='Generated'  style='height: 450px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: contrast(90%) brightness(90%);border-radius: 8px;' />`;

            let returnHtml = "<div style = 'display: flex; align-items: center; gap: 20px;' ><div style='max-width: 900px; font-size: 14px;'>"
            returnHtml += "<p>" + response.text + "</p>" + "</div>";
            returnHtml += x + "</div>";

            //style='height: 250px; width: auto; border: 3px solid #5a3e1b; padding: 5px;background-color: #f5f1e8;box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);filter: sepia(40%) contrast(90%) brightness(90%);border-radius: 8px;'
            

            return returnHtml;

            //return response.text + x;
            // return x;

            ////////////////////////////////////////////////////////

            // setLoading(true);
            // const res = await fetch("/api/generate-image", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ prompt: imgPrompt }),
            // });

            // const data = await res.json();
            // setImageUrl(data.image);
            // setLoading(false);

            // //console.log("data : " + data.image);
            // const x = `<img src='${data.image}' alt='Generated' />`;
            // return x;

            ///////////////////////////////////////////////////////

            // const res = await fetch("/api/generate-image", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ prompt: imgPrompt }),
            //   });

            //   const data = await res.json();
            //   console.log(data.image); // The generated image URL

            //   setImageUrl(data.image); // Set image URL in state
            //   setLoading(false);

            ////////////////////////////////////////////////////////

            // const resImage = await fetch("/api/generate-image", { 
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //       },
            //       body: JSON.stringify({ prompt: imgPrompt }),                 
            // });

            // const resImage = await fetch("/api/generate-image", { method: "POST"  });            
            // const data = await resImage.json();
            // //console.log("message: ", imgPrompt);
            // // console.log("data: ", data);
            // setImageUrl(data.imageUrl);

            //const x = "<img src='/images/brandycask.png' alt='Generated' />";
            //const x = `<img src='${data.imageUrl}' alt='Generated' />`;
            //return x;
            //return response.text ?? "No response from Gemini AI";

        } catch (err: any) {
            setError(err.message);
            return `Error: ${err.message}`;
        } finally {
            setLoading(false);
        }
    };

    return { queryGemini, loading, error };
}
