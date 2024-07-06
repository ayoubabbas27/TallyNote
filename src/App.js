/* global chrome */

import React from 'react';
import "./index.css";
import MainPage from './components/MainPage';
import FormPage from './components/FormPage';
import NotePage from './components/NotePage';
import EditNotePage from './components/EditNotePage';
import { ROUTES } from './utils/routes'
import { useState , useEffect } from 'react';

function App() {

  const [notesData, setNotesData] = useState([]);
  const [page, setPage] = useState(ROUTES.MainPage);
  const [selectedNote, setSelectedNote] = useState({});
  const [notesCount, setNotesCount] = useState();
  const [reviewPromptShownFor, setReviewPromptShownFor] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'dataRequest' }, (response) => {
      if (response.success) {
        setNotesData(response.data);
        setNotesCount(response.notesCount);
        setReviewPromptShownFor(response.reviewPromptShownFor);
        console.log('The notes data has been updated : ',notesData);
      }else{
        console.log('The response of the dataRequest was not a success !');
      }
    })
  },[page]);

  function handlePinned (noteID) {
    chrome.runtime.sendMessage({ type: 'pinnedNoteToggle' , data: noteID }, (response) => {
      if (response.success){
        setNotesData(response.data);
      }
    });
  }

  function renderPage () {
    switch (page) {
      case ROUTES.MainPage:
        return <MainPage 
                  notesData={notesData}
                  setPage={setPage}
                  setSelectedNote={setSelectedNote}
                  handlePinned={handlePinned}
                  notesCount={notesCount}
                  reviewPromptShownFor={reviewPromptShownFor}
                />
      case ROUTES.FormPage:
        return <FormPage setPage={setPage} setSelectedNote={setSelectedNote} />
      case ROUTES.NotePage:
        return <NotePage selectedNote={selectedNote} setPage={setPage}/>
      case ROUTES.EditNotePage:
        return <EditNotePage selectedNote={selectedNote} setPage={setPage} setSelectedNote={setSelectedNote}/>
      default:
        return <MainPage notesData={notesData} setPage={setPage} setSelectedNote={setSelectedNote} handlePinned={handlePinned} notesCount={notesCount} reviewPromptShownFor={reviewPromptShownFor} />
    }
  }



  return (
    <>
      <div className='background'>
          <div className='gradient' />
      </div>
      <main className='z-20'>
        {renderPage()}
      </main>
    </>
    
  );
}

export default App;
