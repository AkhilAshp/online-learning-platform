"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog';

function CourseList() {
    const [CourseList, setCourseList] = useState([]);
  return (
    <div className='m-5'>
        <h2 className='font-bold text-3xl'>Course List</h2>
        { 
            CourseList?.length==0?
            <div className='flex items-center justify-center p-7 flex-col border rounded-xl mt-2 bg-secondary'>
                 <Image src={'/online-education.png'} alt='online-edu' width={120} height={140} className="rounded-e-lg"></Image>
                 <h2 className='my-2 text-xl font-bold'>Looks like you haven't created any courses yet!</h2>
                  <AddNewCourseDialog>
                    <Button>+ Create your first course</Button>
                  </AddNewCourseDialog>
                 
            </div> :
            <div> List of courses.</div> 
        }
    </div>
  )
}

export default CourseList