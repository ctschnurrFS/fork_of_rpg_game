import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {

    try {

        const { message } = await req.json();        

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: message,
          });

        return NextResponse.json({ text: response.text }, { status: 200 });

    } catch (error) {
        console.log("error: " + error);
        return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
    }
}
