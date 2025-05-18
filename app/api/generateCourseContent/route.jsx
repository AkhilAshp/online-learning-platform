import { NextResponse } from "next/server";
import { ai } from "../generateCourseLayout/route";
import axios from "axios";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

const PROMPT = `
Based on the chapter name and topics, generate HTML content for each topic. 
Respond with valid JSON in this format:

{
  "chapterName": "Chapter Title",
  "topics": [
    {
      "topic": "Topic Name",
      "content": "<HTML content here>"
    },
    ...
  ]
}

User Input:
`;

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (
      !courseJson ||
      !courseJson.chapters ||
      courseJson.chapters.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid course data: No chapters found." },
        { status: 400 }
      );
    }

    const model = "gemini-2.0-flash";

    const courseContent = await Promise.all(
      courseJson.chapters.map(async (chapter) => {
        if (!chapter.topics || chapter.topics.length === 0) {
          throw new Error(
            `Chapter "${chapter.chapterName}" has no topics defined.`
          );
        }

        const contents = [
          {
            role: "user",
            parts: [{ text: PROMPT + JSON.stringify(chapter) }],
          },
        ];

        const config = { responseMimeType: "text/plain" };

        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

        const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // console.log("AI Raw Response:", raw);

        const cleaned = raw.replace(/```json|```/g, "").trim();

        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (jsonError) {
          console.error("JSON parsing failed:", cleaned);
          throw new Error("Invalid JSON from AI response");
        }

        const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

        return {
          youtubeVideo: youtubeData,
          courseData: parsed,
        };
      })
    );

    const CourseContent = await Promise.all(courseContent);

    //save to db
    const dbResp = await db.update(coursesTable).set({
        courseContent:CourseContent
    }).where(eq(coursesTable.cid,courseId));
    return NextResponse.json({
      courseName: courseTitle,
      courseId,
      courseContent,
    });
  } catch (error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error?.message || error?.toString() || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Improved YouTube fetch function
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const items = resp?.data?.items || [];

    return items.map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
    }));
  } catch (err) {
    console.error(`YouTube API error for topic "${topic}":`, err);
    return [];
  }
};
