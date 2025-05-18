"use client";

import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Loader2Icon, Sparkle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function AddNewCourseDialog({ children }) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    level: '',
    category: ''
  });

  const router = useRouter();
  const onHandleInputChange = (field, value) => {
    const parsedValue = field === 'noOfChapters' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };


  const onGenerate =async () => {
    // console.log(formData);
    const courseId = uuidv4();
    try{
      
      setLoading(true);
      const result = await axios.post('/api/generateCourseLayout',{
        ...formData,
        courseId:courseId,
      });
      // console.log(result.data);
      setLoading(false);
      // router.push('/workspace/edit-course' + result.data?.courseId);
      router.push(`/workspace/edit-course/${result.data?.courseId}`);

    }catch(e){
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <DialogDescription asChild>
            <div className='flex flex-col gap-4 m-3'>
              <div>
                <label>Course Name</label>
                <Input placeholder="Course Name" onChange={(e) => onHandleInputChange('name', e.target.value)} />
              </div>
              <div>
                <label>Course Description (Optional)</label>
                <Textarea placeholder="Course Description" onChange={(e) => onHandleInputChange('description', e.target.value)} />
              </div>
              <div>
                <label>No. Of Chapters</label>
                <Input type='number' placeholder="No. of chapters" onChange={(e) => onHandleInputChange('noOfChapters', e.target.value)} />
              </div>
              <div className='flex gap-3 items-center'>
                <label>Include Video</label>
                <Switch checked={formData.includeVideo} onCheckedChange={() => onHandleInputChange('includeVideo', !formData.includeVideo)} />
              </div>
              <div>
                <label>Difficulty</label>
                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Category</label>
                <Input placeholder="Category (separated by comma)" onChange={(e) => onHandleInputChange('category', e.target.value)} />
              </div>
              <div className='mt-5'>
                <Button className='w-full' onClick={onGenerate} disabled={loading} >
                  {loading? <Loader2Icon className='animate-spin' /> : <Sparkle className="mr-2" />}
                Generate Course</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
