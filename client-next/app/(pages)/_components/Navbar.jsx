"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    const { user } = useUser();

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);


    return (
        <div className={`hidden md:block fixed top-0 left-0 w-full py-3 px-6 ${isScrolled ? 'shadow-md' : 'shadow-none'} transition-shadow duration-300 z-50`}>
            <div className='flex justify-between'>
                <div className='flex items-center justify-start gap-3 w-full'>
                    <Link href='/'>
                        <div className='text-base ml-3 mr-1 text-white'>
                            <b>RaceCode</b>
                        </div>
                    </Link>
                </div>
                <div className='container flex items-center justify-end gap-3 mx-auto'>
                    <Link href='/play'>
                        <Button variant='secondary' className='hidden md:block mr-1 rounded-full'>
                            Play
                        </Button>
                    </Link>
                    <Link href='/create'>
                        <Button variant='secondary' className='hidden md:block mr-1 rounded-full'>
                            Create
                        </Button>
                    </Link>
                    <Link href='/dashboard'>
                        <Button variant='secondary' className='hidden md:block mr-1 rounded-full'>
                            Dashboard
                        </Button>
                    </Link>
                    {user ? (
                        <UserButton />
                    ) : (
                        <Link href='sign-in'>
                            <Button variant='default' className='hidden md:block rounded-full bg-gradient-to-r from-purple-800 to-purple-500 text-white'>
                                Log in
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar