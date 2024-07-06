/*global chrome*/
import React, { useState , useEffect } from 'react'
import { ROUTES } from '../utils/routes';
import { FaArrowLeft } from "react-icons/fa";

export default function NotePage({ selectedNote , setPage }) {

  const tagsTxt = "#" + selectedNote.tags.join('#');

  function handleDeleteNote () {
    chrome.runtime.sendMessage({ type: 'deleteNote' , data: selectedNote.id } , (response) => {
      if (response.success) {
        setPage(ROUTES.MainPage);
      }
    })
  }

  function handleEditNote () {
    setPage(ROUTES.EditNotePage);
  }

  return (
    <div className='w-full h-full p-4 flex flex-col justify-center items-center gap-4 text-base'>
      <div className='w-full flex flex-row justify-between items-center'>
        <button 
          type='submit'
          className='flex justify-center items-center p-1.5 rounded-full bg-transparent transition-all duration-300 ease-in-out text-indigo-600  hover:bg-indigo-200 hover:cursor-pointer active:bg-opacity-30'
          onClick={() => setPage(ROUTES.MainPage)}
        >
          <FaArrowLeft size={19}/>
        </button>

        <div className='flex flex-row justify-center items-center gap-2'>
          <button 
            class="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-indigo-100 rounded hover:bg-transparent group py-1.5 px-2.5"
            onClick={() => handleEditNote()}
          >
            <span class="w-56 h-48 rounded bg-indigo-600 absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span class="relative w-full text-left text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">Edit</span>
          </button>
          <button 
            class="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-indigo-100 rounded hover:bg-transparent group py-1.5 px-2.5"
            onClick={() => handleDeleteNote()}
          >
            <span class="w-56 h-48 rounded bg-indigo-600 absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span class="relative w-full text-left text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">Delete</span>
          </button>
        </div>
        
      </div>

      <div className='w-full h-0.5 rounded-full bg-indigo-200 '></div>
      
      <div className='w-full flex flex-col justify-center items-center gap-5'>
        <div className='w-full flex flex-row justify-between items-center'>
          <span className='text-gray-500 '>
            {selectedNote.date}
          </span>
          <div className=' text-gray-500 italic w-3/6 truncate text-right mr-1'>
            {tagsTxt}
          </div>
        </div>
        <div className='w-full flex flex-col justify-center items-start gap-2'>
          <span className='text-3xl font-bold w-full truncate text-ellipsis pb-1'>
            {selectedNote.title}
          </span>

          <div className='w-full whitespace-pre-wrap break-words' dangerouslySetInnerHTML={{ __html: selectedNote.content }} />

        </div>
      </div>
    </div>
  )
}
