"use client"
import React from 'react'
import Image from 'next/image';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link'; 

function Hero() {
  const {user, isSignedIn}= useUser();
  return (
    <div>
    <section className="bg-gray-50 flex items-center flex-col">
    <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex ">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Manage Your Expense
          <strong className="font-extrabold text-primary sm:block"> Control Your Money </strong>
        </h1>
  
        <p className="mt-4 sm:text-xl/relaxed">
          Start Creating Your Budget and Save a Ton of Money
        </p>
  
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          
          {isSignedIn ? "" :<a className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-800 focus:outline-none focus:ring active:bg-blue-800 sm:w-auto"
            href="/sign-in">
            Get Started
          </a>  }
         
        </div>
      </div>
    </div>

    <div>
       <Image   src={'/dashboard.png'} alt='Dashboard'
       width={1000}
       height={700}
       className='-mt-9 rounded-xl border-2'
       />
    </div>
  </section>
  </div>

  
    
  )
}

export default Hero