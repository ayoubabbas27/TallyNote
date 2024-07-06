/*global chrome */
import React, { useState , useEffect } from 'react'
import { IoAddOutline } from "react-icons/io5";
import { ROUTES } from '../utils/routes';
import { TbPinned } from "react-icons/tb";
import { TbPinnedFilled } from "react-icons/tb";
import { RiFeedbackLine } from "react-icons/ri";
import ReviewPrompt from './ReviewPrompt';


export default function MainPage({ notesData , setPage , setSelectedNote , handlePinned , notesCount , reviewPromptShownFor }) {

  const sortedNotes = [...notesData].reverse().sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    return 0;
  });

  const [searchBase, setSearchBase] = useState('/ Title');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  useEffect(() => {
    if ( (notesCount > 0) && (notesCount % 10 === 0) && (notesCount !== reviewPromptShownFor) ) {
      setShowReviewPrompt(true);
      chrome.storage.local.set({ reviewPromptShownFor: notesCount});
    }
  }, []);

  const handleOkay = () => {
    chrome.storage.local.remove(['notesCount', 'reviewPromptShownFor']);
    window.open('https://chromewebstore.google.com/detail/tallynote/ehhoabpbgbbainagbdjjdjkgjemnklno?utm_source=ext_app_menu', '_blank');
  };

  const filteredNotes = sortedNotes.filter(note => {
    if (searchBase === '/ Title'){
      return note.title.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    }
  });

  function handleMouseMove(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    const rotateX = deltaY * -15;
    const rotateY = deltaX * 15;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave(event) {
    const card = event.currentTarget;
    card.style.transform = `rotateX(0) rotateY(0)`;
  }

  function stripHtmlTags(html) {
    if (!html) return '';
      html = html.replace(/<br\s*\/?>/gi, '\n');
      html = html.replace(/&nbsp;/gi, ' ');
      return html.replace(/<[^>]*>?/gm, '');
  }
  
  
  


  function renderNotes (){
    if (filteredNotes.length == 0){
      return (
        <div className='text-gray-500 italic font-thin pt-32 px-4'>
          No notes found.
        </div>
      )
    }else{
      return (
        <div className='notes_list '>
          {
            filteredNotes.map((note , index) => (
              <div 
                key={index} 
                className='note-card w-full py-2 px-3 rounded-lg shadow-sm flex flex-col justify-between items-start gap-3 bg-white/30 backdrop-blur-md border border-solid border-gray-400 border-opacity-50 group transition-all duration-300 ease-in-out hover:cursor-pointer hover:shadow-md'  
                onClick={() => {setSelectedNote(note); setPage(ROUTES.NotePage)}}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className='w-full flex flex-col justify-center items-start'>
                  <div className='w-full flex flex-row justify-between items-center'>
                    <span className='font-bold text-[#0B0B0B] w-4/6 truncate '>
                      {note.title}
                    </span>
                    <button 
                      className='flex justify-center items-center p-1.5 rounded-full bg-transparent transition-all duration-300 ease-in-out text-indigo-600  hover:bg-indigo-200 hover:cursor-pointer'
                      onClick={(e) => {e.preventDefault(); e.stopPropagation(); handlePinned(note.id);}}
                    >
                      {
                        note.pinned ? (
                          <TbPinnedFilled size={20}/>
                        ) : (
                          <TbPinned size={20}/>
                        )
                      }
                      
                    </button>
                  </div>
                  <div className='text-slate-800 font-thin italic text-sm mb-1 w-4/6 truncate'>
                    {"#" + note.tags.join('#')}
                  </div>
                </div>

                <div className='w-4/6 line-clamp-2 text-sm text-slate-800 break-words'>
                    {stripHtmlTags(note.content)}
                </div>
              </div>
            ))
          }
        </div>
      )
    }
  }

  return (
    <div className='text-base'>
        <div className='top_section'>
            <div className='header'>
              <div className='flex flex-row justify-center items-end gap-1'>
                <span className='font-semibold text-white text-lg align-text-bottom'>
                {filteredNotes.length} 
                </span>
                <span className='text-indigo-100 align-text-bottom'>
                {filteredNotes.length === 1 ? 'Note' : 'Notes'} 
                </span>
              </div>
              <div className='flex flex-row justify-center items-end gap-2 '>
                <button 
                  className='flex justify-center items-center p-1 rounded-full bg-transparent transition-all duration-300 ease-in-out text-indigo-100 hover:bg-indigo-100 hover:bg-opacity-30 hover:cursor-pointer active:bg-opacity-45'
                  onClick={() => setPage(ROUTES.FormPage)}
                >
                  <IoAddOutline size={25} />
                </button>
                <a 
                  href='https://docs.google.com/forms/d/e/1FAIpQLScOcEzMs-IvxjdgYVLUyuhw5VbPWmfOS16x3aQn9_E-9lYR8g/viewform?usp=sf_link'
                  target='_blank'
                  className='flex justify-center items-center p-1 rounded-full bg-transparent transition-all duration-300 ease-in-out text-indigo-100 hover:bg-indigo-100 hover:text-indigo-100 hover:bg-opacity-30 hover:cursor-pointer active:bg-opacity-45'
                >
                  <RiFeedbackLine size={24} />
                </a>
              </div>
            </div>
            <div className='absolute bottom-0 transform translate-y-6  flex w-5/6 rounded-md bg-white shadow-md z-10'>
              <input 
                type='search'
                name='search'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full border-none bg-transparent px-3 text-gray-900 outline-none focus:outline-none '
              />

              <button 
                class="mt-2 mr-2 mb-2 w-20 py-1 relative inline-flex items-center justify-start overflow-hidden font-medium transition-all ease-in-out bg-indigo-100 rounded hover:bg-transparent group "
                onClick={() => {(searchBase === '/ Title') ? setSearchBase('/ Tag') : setSearchBase('/ Title')}}
              >
                <span class="w-56 h-48 rounded bg-indigo-600 absolute bottom-0 left-0 translate-x-full duration-500 transition-all ease-in-out translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                <span class="relative w-full text-center text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">{searchBase}</span>
              </button>
            </div>
        </div>

        {renderNotes()}

        {showReviewPrompt && <ReviewPrompt setShowReviewPrompt={setShowReviewPrompt} onOkay={handleOkay} />}

    </div>
  )
}
