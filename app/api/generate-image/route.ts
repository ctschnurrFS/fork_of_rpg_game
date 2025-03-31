import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { writeFile } from "fs/promises";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {

  try {

    // console.log("Request received at /api/generate-image");
    // console.log("Headers:", req.headers.get("content-type")); // Debug headers

    // const body = await req.text(); // Read raw body as text
    // console.log("Raw request body:", body);
    ////////////////////////////////////////////////////////////

  const { prompt } = await req.json(); // Receive prompt from client

    // console.log("prompt ASDF: " + prompt);

    // Read request body as text for debugging
    // const bodyText = await req.text();
    // console.log("Raw body text:", bodyText);

    // Parse JSON manually
    // const { prompt } = JSON.parse(bodyText);

   //let contentImage = "Please generate an image about 100 x100 pixels that looks like an old painting of a pokemon driving a cars.";

   //let contentImage = "Please generate an image about 100 x100 pixels that looks like " + prompt;

  //  let contentImage = "Please generate a small image in the style of a medieval painting of a " + prompt;

    //  let contentImage = "Please generate a small image in the style of a painting as if painted on parchment with natural dyes, with faded colors and subtle stains, as if aged by centuries based on the following text: " + prompt; 

     //let contentImage = "Please generate a small image in the style of illustrator Alan Lee's Lord of the Rings paintings based on the following text: " + prompt; 

     //let contentImage = "Please generate a small image in the style of illustrator Alan Lee's Lord of the Rings paintings based on the following text: " + prompt; 
     //let contentImage = "Please generate a small image in the style of H.R. Giger's paintings based on the following text: " + prompt; 
     //let contentImage = "Please generate a small image in the style of Leonardo da Vinci's paintings based on the following text: " + prompt; 
     let contentImage = "Please generate a small image in the style of Pieter Bruegel the Elder's paintings based on the following text: " + prompt;
     //let contentImage = "Please generate a small image in the style of the Blade Runner movies based on the following text: " + prompt;
     

    //contentImage = prompt;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // console.log("prompt: " + contentImage);

    // Generate the image using Google Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contentImage,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // console.log("response: " + response);

    // Extract image data
    const parts = response.candidates?.[0]?.content?.parts || [];
    let imagePath = "";

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (!imageData) {
          throw new Error("Image data is undefined");
        }
        const buffer = Buffer.from(imageData, "base64");

        // Define the path where the file will be saved
        const fileName = `generated-${Date.now()}.png`;
        imagePath = `/generated/${fileName}`; // Publicly accessible path
        const filePath = path.join(process.cwd(), "public", "generated", fileName);

        // Save the image to the public/generated directory
        await writeFile(filePath, buffer);
        console.log(`Image saved as ${filePath}`);
      }
    }

    if (!imagePath) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Image generated successfully", imageUrl: imagePath }, { status: 200 });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import axios from "axios";
// import FormData from "form-data";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
    
//     if (!prompt) {
//       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
//     }

//     //  Prepare payload using FormData
//     const payload = {
//       prompt: prompt,
//       width: 128, //  Tiny image (128x128)
//       height: 128,
//       steps: 10, //  Faster, lower quality
//       output_format: "jpeg", //  Smaller file size
//     };

//     const response = await axios.postForm(
//       //"https://api.stability.ai/v2beta/stable-image/generate/ultra", //  Using 'ultra' model
//       "https://api.stability.ai/v2beta/stable-image/generate/core",
//       axios.toFormData(payload, new FormData()),
//       {
//         responseType: "arraybuffer", //  Binary image response
//         headers: {
//           Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
//           Accept: "image/*",
//         },
//       }
//     );

//     if (response.status !== 200) {
//       throw new Error(`${response.status}: ${response.data.toString()}`);
//     }

//     //  Convert image to Base64 to return as JSON
//     const imageBase64 = Buffer.from(response.data).toString("base64");
//     return NextResponse.json({ image: `data:image/webp;base64,${imageBase64}` });


//   } catch (error: any) {
//     console.error("Stable Diffusion Error:", error.message);
//     return NextResponse.json(
//       { error: error.response?.data || "Failed to generate image" },
//       { status: error.response?.status || 500 }
//     );
//   }
// }



// // import { NextResponse } from "next/server";
// // import axios from "axios";
// // // import FormData from "form-data";

// // export async function POST(req: Request) {
// //   try {
// //     const { prompt } = await req.json();

// //     if (!prompt) {
// //       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
// //     }

// //     console.log("STABILITY_AI_API_KEY: " + process.env.STABILITY_AI_API_KEY)


// //     //     import fs from "node:fs";
// //     // import axios from "axios";
// //     // import FormData from "form-data";

// //     // const payload = {
// //     //   prompt: "Lighthouse on a cliff overlooking the ocean",
// //     //   output_format: "webp"
// //     // };

// //     // const response = await axios.post(
// //     //   "https://api.stability.ai/v2beta/stable-image/generate/sd3", //  FIXED URL
// //     //   {
// //     //     prompt: prompt,
// //     //     width: 256,
// //     //     height: 256,
// //     //     steps: 30, //  Increased quality
// //     //     style_preset: "photographic", //  Stability requires this
// //     //   },
// //     //   {
// //     //     headers: {
// //     //       Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
// //     //       "Content-Type": "application/json",
// //     //     },
// //     //   }
// //     // );
    

// //     // const response = await axios.post(
// //     //   "https://api.stability.ai/v2beta/stable-image/generate/sd3",
// //     //   {
// //     //     prompt: prompt,
// //     //     width: 256, //  Supported size
// //     //     height: 256,
// //     //     steps: 10, //  Defines image quality
// //     //     style_preset: "enhance", //  Optional style (e.g., "anime", "photographic")
// //     //   },
// //     //   {
// //     //     headers: {
// //     //       Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
// //     //       "Content-Type": "application/json",
// //     //     },
// //     //   }
// //     // );


// //     // const response = await axios.post(
// //     //   "https://api.stability.ai/v2beta/stable-image/generate/core",
// //     //   {
// //     //     prompt: prompt,
// //     //     width: 256, //  Ensure correct format
// //     //     height: 256,
// //     //     steps: 10, //  Defines image quality
// //     //   },
// //     //   {
// //     //     headers: {
// //     //       Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
// //     //       "Content-Type": "application/json",
// //     //     },
// //     //   }
// //     // );

// //     // const response = await axios.post(
// //     //   "https://api.stability.ai/v2beta/stable-image/generate/core",
// //     //   {
// //     //     prompt: prompt,
// //     //     width: 256, //  Supports 256x256 images!
// //     //     height: 256,
// //     //     steps: 30, // More steps = better quality
// //     //   },
// //     //   {
// //     //     headers: {
// //     //       Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
// //     //       "Content-Type": "application/json",
// //     //     },
// //     //   }
// //     // );

// //     return NextResponse.json({ image: response.data.image });

// //   } catch (error) {
// //     console.error("Stable Diffusion Error:", error);
// //     return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
// //   }
// // }



// // // import { NextResponse } from "next/server";
// // // import OpenAI from "openai";

// // // const openai = new OpenAI({
// // //   apiKey: process.env.OPENAI_API_KEY!, // Store this in your .env file
// // // });

// // // export async function POST(req: Request) {
// // //   try {
// // //     const { prompt } = await req.json();

// // //     if (!prompt) {
// // //       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
// // //     }

// // //     const response = await openai.images.generate({
// // //       //model: "dall-e-3", // or "dall-e-2"
// // //       model: "dall-e-2",
// // //       prompt: prompt,
// // //       n: 1,
// // //       size: "256x256", // Other options: "256x256", "512x512", "1024x1024"
// // //     });

// // //     return NextResponse.json({ image: response.data[0].url });
// // //   } catch (error) {
// // //     console.error("DALL·E Error:", error);
// // //     return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
// // //   }
// // // }



// // // import { GoogleGenAI } from "@google/genai";
// // // import { NextResponse } from "next/server";
// // // import { writeFile } from "fs/promises";
// // // import path from "path";

// // // const ai = new GoogleGenAI({
// // //   apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, // Use backend-only env variable
// // // });

// // // //export async function POST(req: Request) {
// // //   export async function POST(req: Request) {

// // //   try {
// // //     // Request image from Gemini API
// // //     //const { prompt } = await req.json();
// // //     let prompt = "Four horsemen of the apocalypse";
// // //     const response = await ai.models.generateContent({
// // //       model: 'gemini-2.0-flash-exp-image-generation',
// // //       contents: prompt,
// // //       config: {
// // //         responseModalities: ["Text", "Image"],
// // //       },
// // //     });

// // //     const parts = response?.candidates?.[0]?.content?.parts || [];
// // //     let imageData = "";

// // //     for (const part of parts) {
// // //       if (part.inlineData) {
// // //         imageData = `data:image/png;base64,${part.inlineData.data}`; // Full Base64 data URL
// // //       }
// // //     }

// // //     return NextResponse.json({ imageUrl: imageData });

// // //     // const parts = response?.candidates?.[0]?.content?.parts || [];
// // //     // let textResponse = "";
// // //     // let imageData = "";

// // //     // for (const part of parts) {
// // //     //   if (part.text) {
// // //     //     textResponse = part.text;
// // //     //   } else if (part.inlineData) {
// // //     //     imageData = part.inlineData.data || ""; // Base64-encoded image
// // //     //   }
// // //     // }

// // //     // return NextResponse.json({
// // //     //   text: textResponse,
// // //     //   image: imageData, // Send base64 image to frontend
// // //     // });
// // //   } catch (error) {
// // //     console.error("Failed to generate image:", error);
// // //     return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
// // //   }
// // // }
