"use client"

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList';

function EditCourse() {
    const {courseId} = useParams();
    console.log(courseId); 
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState();
    useEffect(()=> {
        GetCourseInfo();
    }, [])


    const GetCourseInfo = async ()=>{
        setLoading(true);
        const result = await axios.get('/api/courses?courseId='+courseId);
        setLoading(false);
        // console.log(result.data);
        setCourse(result.data);
    }
    return (
        <div>
            <CourseInfo course={course}></CourseInfo>
            <ChapterTopicList course={course}></ChapterTopicList>
        </div>
    )
} 

export default EditCourse