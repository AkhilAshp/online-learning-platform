"use client"

import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Book, Compass, LayoutDashboard ,PencilRulerIcon, UserCircle2Icon, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AddNewCourseDialog from './AddNewCourseDialog';
function AppSideBar() {

  const path = usePathname();
  const SideBarOptions = [
    {
      title:'Dashboard',
      icon:LayoutDashboard,
      path:'/workspace',
    },
    {
      title:'My Learning',
      icon:Book,
      path:'/workspace/my-learning',
    },
    {
      title:'Billing',
      icon:WalletCards,
      path:'/workspace/billing',
    },
    {
      title:'Profile',
      icon:UserCircle2Icon,
      path:'/workspace/profile',
    }
  ]
  return (
    <Sidebar>
      <SidebarHeader className={'p-4'}>
        <Image src={'/logo.svg'} alt='logo' width={38} height={38} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>Create New Course</Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup >
          <SidebarGroupContent>
            <SidebarMenu>
              {
                SideBarOptions.map((item,index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild className={'p-5'}>
                      <Link href={item.path} className={`text-[17px] ${path==item.path && 'text-primary bg-purple-100'}`}>
                      <item.icon className='h-7 w-7'/>
                      <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSideBar