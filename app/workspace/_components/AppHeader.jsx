import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 flex justify-between items-center shadow-sm'>
        <SidebarTrigger/>
        <UserButton></UserButton>
    </div>
  )
}

export default AppHeader