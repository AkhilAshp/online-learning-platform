import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; 
import axios from "axios";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

const PROMPT = `
Based on the chapter name and topics, generate HTML content for each topic. 
Respond with valid JSON in this format:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string",
      "content": "HTML content string"
    }
  ]
}
User Input:
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { courseJson, courseTitle, courseId } = body;

    // Initialize locally to avoid "undefined" errors from failed imports
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const promises = courseJson?.chapters?.map(async (chapter) => {
      const config = {
        responseMimeType: 'application/json',
      };
      
      // Using the Gemini 3 Flash Preview ID
      const model = 'gemini-3-flash-preview'; 
      
      const contents = [
        {
          role: 'user',
          parts: [{ text: PROMPT + JSON.stringify(chapter) }],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      const JSONResp = JSON.parse(response.text);

      // Get Youtube Video
      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
      
      return {
        youtubeVideo: youtubeData,
        courseData: JSONResp
      };
    });

    const CourseContent = await Promise.all(promises);

    // Save to database
    await db.update(coursesTable).set({
      courseContent: CourseContent
    }).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      CourseContent: CourseContent
    });

  } catch (error) {
    console.error("Error in generateCourseContent API:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
const GetYoutubeVideo = async (topic) => {
  const params = {
    part: 'snippet',
    q: topic,
    maxResults: 4,
    type: 'video',
    key: process.env.YOUTUBE_API_KEY,
  };
  const resp = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListResp = resp.data.items || [];
  
  return youtubeVideoListResp.map(item => ({
    videoId: item.id?.videoId,
    title: item?.snippet?.title
  }));
}