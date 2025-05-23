import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
    GoogleGenAI,
    } from '@google/genai';
import axios from 'axios';
import { NextResponse } from 'next/server';
const PROMT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description, Chapter Name, Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format, Topic under each chapters, Duration for each chapters etc, in JSON format only
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
}

`;


export const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY,
});

export async function POST(req) {
    const {courseId,...formData} = await req.json();
    const user = await currentUser();
    // const {has}=await auth()
    // const hasPremiumAccess = has({plan:'starter'})
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
        responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.0-flash';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: PROMT + JSON.stringify(formData),
                },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });

    console.log(response.candidates[0].content.parts[0].text);
    const RawResp = response?.candidates[0]?.content.parts[0]?.text;
    const RawJson = RawResp.replace('```json','').replace('```','');
    const JSONResp = JSON.parse(RawJson);
    console.log('json resp',JSONResp);


    
    //generate Image Banner
    // const ImagePrompt = JSONResp.course?.imagePrompt;
    // const bannerImageUrl =await GenerateImage(ImagePrompt);
    //generate Image Banner
    const ImagePrompt = JSONResp.course?.imagePrompt;
    let bannerImageUrl;

    if (ImagePrompt) {
      try {
        bannerImageUrl = await GenerateImage(ImagePrompt);
      } catch (error) {
        console.error("Image generation failed, using default image.", error);
        bannerImageUrl = '/online-education.png'; 
      }
    } else {
      console.warn("No imagePrompt found, using default image.");
      bannerImageUrl = '/online-education.png'; 
}


    //save to database
    const result = await db.insert(coursesTable).values({
        ...formData,
        courseJson:JSONResp,
        userEmail:user?.primaryEmailAddress?.emailAddress ,
        cid:courseId,
        bannerImageUrl:bannerImageUrl,
    });
    return NextResponse.json({courseId: courseId}); 
}

const GenerateImage = async(imagePrompt)=>{
  const BASE_URL='https://aigurulab.tech';
  const result = await axios .post(BASE_URL+'/api/generate-image',
          {
              width: 1024,
              height: 1024,
              input: imagePrompt,
              model: 'sdxl',//'flux'
              aspectRatio:"16:9"//Applicable to Flux model only
          },
          {
              headers: {
                  'x-api-key': process?.env?.AI_GURU_LAB_API, // Your API Key
                  'Content-Type': 'application/json', // Content Type
              },
          })
  console.log(result.data.image) //Output Result: Base 64 Image
  return result.data.image;
}