"use client"

import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs'
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react'

function Provider({children}) {
    const {user} = useUser();

    const [userDetail, setUserDetail] = useState();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
    
    const CreateNewUser = useCallback(async()=>{
        try {
            const result = await axios.post('/api/user',{
                name:user?.fullName,
                email:user?.primaryEmailAddress?.emailAddress,
            });
            console.log(result.data);
            setUserDetail(result.data);
        } catch (error) {
            console.error('Error creating/fetching user:', error);
        }
    }, [user?.fullName, user?.primaryEmailAddress?.emailAddress]);

    useEffect(()=>{
        user && CreateNewUser();
    },[user, CreateNewUser]);
    return (
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <SelectedChapterIndexContext.Provider value={{selectedChapterIndex, setSelectedChapterIndex}}>
            <div>{children}</div>
            </SelectedChapterIndexContext.Provider>
        </UserDetailContext.Provider>
        
    )
}

export default Provider