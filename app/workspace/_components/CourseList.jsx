"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';

function CourseList() {
    const [CourseList, setCourseList] = useState([]);
    const {user} = useUser();

    useEffect(()=>{
      user && GetCourseList();
    },[user]);
    
    const GetCourseList = async()=>{
      const result=await axios.get('/api/courses');
      console.log(result.data);
      setCourseList(result.data);
    }

  return (
    <div className='m-5'>
        <h2 className='font-bold text-3xl'>Course List</h2>
        <br></br>
        { 
            CourseList?.length==0?
            <div className='flex items-center justify-center p-7 flex-col border rounded-xl mt-2 bg-secondary'>
                  <Image 
                    src="/online-education.png" 
                    alt="online-edu" 
                    width={120} 
                    height={140} 
                    className="rounded-e-lg" 
                  />
                 <h2 className='my-2 text-xl font-bold'>Looks like you haven't created any courses yet!</h2>
                  <AddNewCourseDialog>
                    <Button>+ Create your first course</Button>
                  </AddNewCourseDialog>
                 
            </div> :
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'> 
              {CourseList?.map((course,index)=>(
                <CourseCard course={course} key={index}/>
              ))}
            </div> 
        }
    </div>
  )
}

export default CourseList