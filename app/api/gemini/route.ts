import { NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";

// "use client";
// import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const formattedMessage = `Please respond to this RPG game prompt, set in a fantasy world like Lord of the Rings, in 100 words or less: ${message}`;

        console.log("message: " + message);

        // const response = await ai.models.generateContent({
        //     model: 'gemini-2.0-flash-exp-image-generation',
        //     //model: "gemini-2.0-flash",
        //     contents: formattedMessage,
        // });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: formattedMessage,
          });
          //console.log(response.text);        

        // const response = await ai.models.generateContent({
        //     // model: "gemini-2.0-flash",
        //     // contents: message,
        //     model: 'gemini-2.0-flash-exp-image-generation',
        //     contents: message,
        //     config: {
        //         responseModalities: ['Text', 'Image']
        //     },
        // });


        // ////////////////////////////////////////

        // // Extract image data
        // const parts = response.candidates?.[0]?.content?.parts || [];

        // let imageDataReturn;

        // for (const part of parts) {
        //     console.log("part: " + part);
        //     if (part.inlineData) {
        //         //console.log("inlineData: " + part.inlineData);
        //         console.log(" part.inlineData.inlineData: " + part.inlineData.data);
        //         imageDataReturn = part.inlineData.data;
        //     }
        // }
        // ///////////////////////////////////////

        //console.log("response.text: " + response.text);

        return NextResponse.json({ text: response.text }, { status: 200 });
    } catch (error) {
        console.log("error: " + error);
        return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
    }
}
