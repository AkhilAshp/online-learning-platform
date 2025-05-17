"use client";

import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Sparkle } from 'lucide-react';

function AddNewCourseDialog({ children }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    level: '',
    category: ''
  });

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onGenerate = () => {
    console.log(formData);
    
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
                <Button className='w-full' onClick={onGenerate}><Sparkle className="mr-2" />Generate Course</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
