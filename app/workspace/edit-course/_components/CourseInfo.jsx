"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Clock, Loader2Icon, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function CourseInfo({ course }) {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateCourseContent = async () => {
    if (!courseLayout || !course?.name || !course?.cid) {
      console.warn("Missing course data");
      return;
    }

    try {
      setLoading(true);
    //   console.log('Sending courseLayout:', courseLayout);

      const result = await axios.post('/api/generateCourseContent', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });

    //   console.log(result.data);
    router.replace('/workspace');
    toast.success('Course Generated successfully');
    } catch (error) {
      console.error("API error:", error?.response?.data || error.message);
      toast.error("Server Side error, Try Again!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
      <div className='flex flex-col gap-3'>
        <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
        <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Clock className='text-blue-500' />
            <section>
              <h2 className='font-bold'>Duration</h2>
              <h2>2 Hours</h2>
            </section>
          </div>
          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Book className='text-green-500' />
            <section>
              <h2 className='font-bold'>Chapter</h2>
              <h2>2 Hours</h2>
            </section>
          </div>
          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <TrendingUp className='text-red-500' />
            <section>
              <h2 className='font-bold'>Difficulty</h2>
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>

        <Button className='max-w-sm' onClick={GenerateCourseContent} disabled={loading}>
          {loading ? <Loader2Icon className='animate-spin' /> : <Settings className="mr-2" />}
          Generate Content
        </Button>
      </div>

      <Image
        src={course?.bannerImageUrl || "/online-education.png"}
        alt="Banner Image"
        width={400}
        height={400}
        className="w-full mt-5 md:mt:0 object-cover aspect-auto h-[240px] rounded-2xl"
      />
    </div>
  );
}

export default CourseInfo;
