import React, { useContext } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';

function ChapterListSidebar({courseInfo}) {
    const course = courseInfo?.courses;
    const enrollCourse = courseInfo?.enrollCourse
    const courseContent = courseInfo?.courses?.courseContent
    const {selectedChapterIndex, setSelectedChapterIndex} = useContext(SelectedChapterIndexContext);
    // console.log('Inside ChapterListSideBar: '+courseInfo);
    let completedChapter = enrollCourse?.completedChapters ?? [];
    console.log('Green color')
    console.log(completedChapter)
  return (
    <div className='w-80 bg-secondary h-screen p-5'>
        <h2 className="my-3 font-bold text-xl">Chapters ({courseContent?.length})</h2>
        <div className=''>
            <Accordion type="single" collapsible>
                {
                    courseContent?.map((chapter, index) => (
                        <AccordionItem value={chapter?.courseData?.chapterName} key={index}
                            onClick={()=>setSelectedChapterIndex(index)}
                        >
                        <AccordionTrigger className={'text-lg font-medium'}>{index+1}.{chapter?.courseData?.chapterName}</AccordionTrigger>
                        <AccordionContent asChild>
                            <div className=''>
                                {chapter?.courseData?.topics.map((topic,index_)=>(
                                    <h2  key={index_} className={`p-2 bg-white my-1 rounded-lg 
                                        ${completedChapter.includes(index) ? 'bg-green-400':'bg-white'}`}>
                                        {topic?.name}</h2>
                                ))}
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </div>
    </div>
  )
}

export default ChapterListSidebar