import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 border-b shadow-sm flex justify-between'>
        <div>
            search Bar
        </div>
        <div>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader