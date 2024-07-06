chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.storage.local.set({ notes: [] , notesCount: 0 , reviewPromptShownFor: 0 }, () => {
            console.log('Initial installation: notes storage set up.');
        });
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.storage.local.get(['notes' , 'notesCount' , 'reviewPromptShownFor'], (result) => {
            const notesArray = result.notes || [];
            const prevNotesCount = result.notesCount;
            const prevReviewPromptShownFor = result.reviewPromptShownFor;
            const migratedNotes = notesArray.map(note => {
                return {
                    ...note,
                    newProperty: 'defaultValue' 
                };
            });
            chrome.storage.local.set({ notes: migratedNotes , notesCount: prevNotesCount , reviewPromptShownFor: prevReviewPromptShownFor}, () => {
                console.log('Update: notes migrated and saved.');
            });
        });
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'dataRequest'){
        chrome.storage.local.get(['notes' , 'notesCount' , 'reviewPromptShownFor'], (result) => {
            if (result.notes){
                sendResponse({ success: true , data: result.notes , notesCount: result.notesCount , reviewPromptShownFor: result.reviewPromptShownFor});
            }else{
                sendResponse({ success: false , data: []});
            }
        })
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'addNote') {
        chrome.storage.local.get(['notes', 'notesCount'] , (result) => {
            const newNotes = result.notes || [];
            newNotes.push(message.data);
            if (result.notesCount !== undefined){
                let newNotesCount = result.notesCount;
                newNotesCount++;
                console.log('Adding a note : case where the noteCount exist in storage. new value : ', newNotesCount);
                chrome.storage.local.set({ notes: newNotes , notesCount: newNotesCount } , () => {
                    sendResponse({ success: true });
                });
            }else{
                console.log('case where the notesCount does note exist in storage');
                chrome.storage.local.set({ notes: newNotes } , () => {
                    sendResponse({ success: true });
                });
            }
        });
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'deleteNote') {
        chrome.storage.local.get('notes' , (result) => {
            let notes = result.notes;
            let newNotes = notes.filter((note) => note.id !== message.data);
            chrome.storage.local.set({ notes: newNotes }, () => {
                sendResponse({ success: true });
            })
        })
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'editNote'){
        chrome.storage.local.get('notes' , (result) => {
            let updatedData = message.note_new_data;
            let newNotes = result.notes;
            newNotes.forEach(note => {
                if (note.id === updatedData.id){
                    note.title = updatedData.title;
                    note.tags = updatedData.tags;
                    note.date = updatedData.date;
                    note.content = updatedData.content
                }
            });
            chrome.storage.local.set({ notes: newNotes }, () => {
                sendResponse({ success: true });
            })
        })
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'pinnedNoteToggle'){
        chrome.storage.local.get('notes', (result) => {
            let newNotes = result.notes;
            newNotes.forEach((note) => {
                if (note.id === message.data){
                    note.pinned = !note.pinned;
                }
            })
            chrome.storage.local.set({ notes: newNotes }, () => {
                sendResponse({ success: true , data: newNotes });
            })
        })
    }
    return true;
})

