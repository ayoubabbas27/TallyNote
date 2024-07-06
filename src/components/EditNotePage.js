/*global chrome */
import React, { useState , useEffect } from 'react'
import { ROUTES } from '../utils/routes';
import { FaArrowLeft } from "react-icons/fa";
import RichTextEditor from './RichTextEditor';


export default function EditNotePage({ setPage , selectedNote , setSelectedNote }) {

  const [noteTitle, setNoteTitle] = useState(selectedNote.title);
  const [noteTags, setNoteTags] = useState(selectedNote.tags.join(','));
  const [noteContent, setNoteContent] = useState(selectedNote.content);

  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('').slice(0,10).join('').split('-').reverse().join(' / '); 
  }

  function handleEditNote () {
    if ((noteTitle.trim().replace(/\s+/g, '') !== '') && (noteTags.trim().replace(/\s+/g, '') !== '') && isContentNotEmpty(noteContent)){
        const noteDate = getCurrentDate();
        const updateNoteData = {
          id: selectedNote.id,
          title: noteTitle,
          tags: noteTags.trim().replace(/\s+/g, '').split(','),
          date: noteDate,
          content: noteContent
        }
        chrome.runtime.sendMessage({ type: 'editNote' , note_new_data: updateNoteData } , (response) => {
            if (response.success){
                setSelectedNote(updateNoteData);
                setPage(ROUTES.NotePage);
            }
        })     
      }    
  }

  function isContentNotEmpty(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent.trim().replace(/\s+/g, '') !== '';
  }

  return (
    <div className='w-full h-full p-4 flex flex-col justify-center items-center gap-4 text-base'>
      <div className='w-full flex flex-row justify-between items-center'>
        <button 
          type='submit'
          className='flex justify-center items-center p-1.5 rounded-full bg-transparent transition-all duration-300 ease-in-out text-indigo-600  hover:bg-indigo-200 hover:cursor-pointer active:bg-opacity-30'
          onClick={() => setPage(ROUTES.NotePage)}
        >
          <FaArrowLeft size={19}/>
        </button>

        <button 
          class="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-indigo-100 rounded hover:bg-transparent group py-1.5 px-2.5"
          onClick={() => handleEditNote()}
        >
          <span class="w-56 h-48 rounded bg-indigo-600 absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span class="relative w-full text-left text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">Save Note</span>
        </button>
      </div>

      <div className='w-full h-0.5 rounded-full bg-indigo-200 '></div>

      <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
        <div className='w-full flex flex-col justify-center items-start'>
          <label className='text-[#0B0B0B] mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
            Title
          </label>
          <input 
            type='text'
            required
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder='e.g: Project Tasks'
            className='border border-solid border-gray-300 w-full px-3 py-2 rounded-md bg-white transition-all duration-300 ease-in-out shadow-sm outline-none focus:outline-none focus:shadow-md'
          />
        </div>  
        <div className='w-full flex flex-col justify-center items-start'>
          <label className='text-[#0B0B0B] mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
            Tags (tag1, tag2, tag3)
          </label>
          <input 
            type='text'
            required
            value={noteTags}
            onChange={(e) => setNoteTags(e.target.value)}
            placeholder='e.g: project, tasks, urgent'
            className='border border-solid border-gray-300 w-full px-3 py-2 rounded-md bg-white transition-all duration-300 ease-in-out shadow-sm outline-none focus:outline-none focus:shadow-md'
          />
        </div>  

        <div className='w-full h-full flex flex-col justify-center items-start'>
          <label className='text-[#0B0B0B] mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
            Content
          </label>
          <RichTextEditor noteContent={noteContent} setNoteContent={setNoteContent} selectedNote={selectedNote}/>
        </div> 
      </div>
    </div>
  )
}
