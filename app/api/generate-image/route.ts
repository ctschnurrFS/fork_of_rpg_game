import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
// import { writeFile } from "fs/promises";
// import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {

  try {

    const { prompt } = await req.json(); // Receive prompt from client

    let contentImage = "Please generate an image in the style of Pieter Bruegel the Elder's paintings based on the following prompt: " + prompt;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Generate the image using Google Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      //model: "gemini-2.0-flash-exp",
      contents: contentImage,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Extract image data
    const parts = response.candidates?.[0]?.content?.parts || [];

    let imageDataReturn;

    for (const part of parts) {
      if (part.inlineData) {
        imageDataReturn = part.inlineData.data;
      }
    }

    if (!imageDataReturn) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    // Decode the base64 image data
    const imageBuffer = Buffer.from(imageDataReturn, 'base64');

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store", 
      },
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


