import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai'; 
import axios from 'axios';
import { NextResponse } from 'next/server';

const PROMT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Chapter Name, Image Prompt (Create a modern, flat-style 2D digital illustration) for Course Banner in 3d format, Topic under each chapters, Duration for each chapters etc, in JSON format only
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": true,
    "noOfChapters": 0,
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          {
            "name": "string",
            "description": "string",
            "imagePrompt": "string"
          }
        ]
      }
    ]
  }
}`;

export async function POST(req) {
    try {
        const { courseId, ...formData } = await req.json();
        const user = await currentUser();

        // Initialize the new 2026 SDK
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const model = 'models/gemini-3-flash-preview'; // 1.5 is more stable for free tier quotas
        const config = { 
            responseMimeType: 'application/json' 
        };

        const contents = [
            {
                role: 'user',
                parts: [{ text: PROMT + JSON.stringify(formData) }],
            },
        ];

        // 1. Generate Course Layout with Retry Logic
        let response;
        let retries = 3;
        while (retries > 0) {
            try {
                response = await ai.models.generateContent({
                    model,
                    config,
                    contents,
                });
                break; // Success!
            } catch (err) {
                if (err.status === 429 && retries > 1) {
                    console.warn(`Quota hit. Retrying in 5 seconds... (${retries-1} left)`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    retries--;
                } else {
                    throw err; // Permanent error
                }
            }
        }

        const JSONResp = JSON.parse(response.text);
        
        // 2. Generate Image Banner
        const imagePrompt = JSONResp.course?.imagePrompt || formData?.topic;
        let bannerImageUrl = '/online-education.png'; 

        if (imagePrompt) {
            try {
                bannerImageUrl = await GenerateImage(imagePrompt);
            } catch (error) {
                console.error("Image API failed, using default.");
            }
        }

        // 3. Save to Database
        await db.insert(coursesTable).values({
            ...formData,
            courseJson: JSONResp,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            cid: courseId,
            bannerImageUrl: bannerImageUrl,
        });

        return NextResponse.json({ courseId: courseId });

    } catch (error) {
        console.error("Critical Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const GenerateImage = async (imagePrompt) => {
    const result = await axios.post('https://aigurulab.tech/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: imagePrompt,
            model: 'gemini-3-flash-preview',
            aspectRatio: "16:9"
        },
        {
            headers: {
                'x-api-key': process.env.AI_GURU_LAB_API,
                'Content-Type': 'application/json',
            },
        }
    );
    return result.data.image;
};