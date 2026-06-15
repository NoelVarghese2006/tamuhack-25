"use client";

import React from 'react'
import { CiTrash } from "react-icons/ci";
import { toast } from "react-hot-toast"
import { useState } from 'react';
const DashboardCard = ({ title, code }) => {
  const [moved, setMoved] = useState(false);

  const handleClick = async () => {
    try {
      const url = `/api/games?gameId=${code}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Attempt to get error message from server response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      setMoved(true); // Trigger animation only on success
      toast.success('Game deleted');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      console.error('Delete failed:', error);
    }
  };


  return (
    <div className={`transition-transform transform ${moved ? 'translate-x-[-1500px]' : ''} w-[300px] h-[120px] bg-gray-900 border-[1px] border-white rounded-md z-10 relative`}>
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='font-bold text-lg'>{title}</div>
        <div>Game Code:</div>
        <div>{code}</div>
      </div>
      <div className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm hover:bg-red-700'  onClick={handleClick}>
        <CiTrash className='text-white' />
      </div>
    </div>
  );
};

export default DashboardCard