"use client";

import { Gift } from 'lucide-react';
import React from 'react';

function ChapterTopicList({ course }) {
    const courseLayout = course?.courseJson?.course;
    console.log(courseLayout);
    return (
        <div>
            <h2 className="font-bold text-2xl m-3">Chapters & Topics</h2>
            <div className="flex flex-col items-center justify-center mt-10">
                {courseLayout?.chapters?.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="flex flex-col items-center w-full max-w-2xl">
                        {/* Chapter Header */}
                        <div className="p-4 border shadow rounded-xl bg-primary text-white w-full text-center">
                            <h2>Chapter {chapterIndex + 1}</h2>
                            <h2 className="font-bold text-lg">{chapter.chapterName}</h2>
                            <div className="text-xs flex justify-between mt-2">
                                <span>Duration: {chapter.duration}</span>
                                <span>Topics: {chapter?.topics?.length}</span>
                            </div>
                        </div>

                        {/* Topics */}
                        <div className="w-full">
                            {chapter?.topics?.map((topic, topicIndex) => (
                                <div key={topicIndex} className="flex flex-col items-center">
                                    {/* Connector line */}
                                    {topicIndex !== 0 && <div className="h-10 bg-gray-300 w-1"></div>}

                                    {/* Topic Display */}
                                    <div className="flex items-center gap-5 w-full justify-center mb-4">
                                        {/* Left Side Description (even index) */}
                                        <span className={`max-w-xs text-sm text-gray-600 ${topicIndex % 2 !== 0 && 'text-transparent'}`}>
                                            {topic.name}
                                        </span>

                                        {/* Circle node */}
                                        <div className="rounded-full bg-gray-300 px-6 py-4 text-gray-500 text-sm font-semibold text-center">
                                            {topicIndex + 1}
                                        </div>

                                        {/* Right Side Description (odd index) */}
                                        <span className={`max-w-xs text-sm text-gray-600 ${topicIndex % 2 === 0 && 'text-transparent'}`}>
                                            {topic.name}
                                        </span>
                                    </div>

                                    {/* Gift icon and Finish message at the last topic of the last chapter */}
                                    {chapterIndex === courseLayout.chapters.length - 1 && topicIndex === chapter.topics.length - 1 && (
                                        <>
                                            <div className="h-10 bg-gray-300 w-1"></div>
                                            <div className="flex flex-col items-center justify-center">
                                                <Gift className="rounded-full bg-gray-300 h-14 w-14 p-3 text-gray-600" />
                                                <p className="font-bold text-l mt-2">Course Complete 🎉</p>
                                            </div>
                                            <div className="h-10 bg-gray-300 w-1"></div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChapterTopicList;
