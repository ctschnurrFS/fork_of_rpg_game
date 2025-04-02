import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
// import { writeFile } from "fs/promises";
// import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {

  try {

    const { prompt } = await req.json(); // Receive prompt from client

    //let contentImage = "Please generate a small image in the style of a painting as if painted on parchment with natural dyes, with faded colors and subtle stains, as if aged by centuries based on the following text: " + prompt; 
    //let contentImage = "Please generate a small image in the style of illustrator Alan Lee's Lord of the Rings paintings based on the following text: " + prompt; 
    let contentImage = "Please generate a ssuper small size image in the style of Pieter Bruegel the Elder's paintings based on the following text: " + prompt;
    //let contentImage = "Please generate a super small size image in the style of Picasso's paintings based on the following text: " + prompt;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Generate the image using Google Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
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


