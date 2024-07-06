import React, { useState , useRef , useEffect } from 'react';

import { FaBold } from "react-icons/fa";
import { FiItalic } from "react-icons/fi";
import { FiUnderline } from "react-icons/fi";
import { GoStrikethrough } from "react-icons/go";
import { BsJustifyLeft } from "react-icons/bs";
import { BsJustify } from "react-icons/bs";
import { BsJustifyRight } from "react-icons/bs";
import { GoListOrdered } from "react-icons/go";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { IoIosLink } from "react-icons/io";

export default function RichTextEditor({ noteContent , setNoteContent , selectedNote}) {

    const editorRef = useRef(null);

    const [boldActive, setBoldActive] = useState(false);
    const [italicActive, setItalicActive] = useState(false);
    const [underlineActive, setUnderlineActive] = useState(false);
    const [strikeThroughActive, setStrikeThroughActive] = useState(false);
    const [alignment, setAlignment] = useState('left'); // Possible values: left, center, right, justify
    const [orderedListActive, setOrderedListActive] = useState(false);
    const [unorderedListActive, setUnorderedListActive] = useState(false);
    const [linkActive, setLinkActive] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        const editor = editorRef.current;
        editor.addEventListener('mouseup', handleSelectionChange);
        editor.addEventListener('keyup', handleSelectionChange);
        editor.addEventListener('click', handleLinkClick); // Listen for click on links

        if (selectedNote !== null){
            editorRef.current.innerHTML = noteContent;
            // Focus cursor at the end of the contentEditable div
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editor);
            range.collapse(false); // Collapse range to the end
            selection.removeAllRanges();
            selection.addRange(range);
            editor.focus();
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'A') {
                    node.setAttribute('target', '_blank');
                    }
                });
                }
            });
        });

        observer.observe(editor, { childList: true, subtree: true });


        return () => {
            editor.removeEventListener('mouseup', handleSelectionChange);
            editor.removeEventListener('keyup', handleSelectionChange);
            editor.removeEventListener('click', handleLinkClick);
            editor.removeEventListener('input', handleInput);
        };
    }, [noteContent]);

    function handleInput (event) {
        const editor = editorRef.current;
        const htmlContent = editor.innerHTML;
        setNoteContent(htmlContent);
    }

    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
        handleSelectionChange();
    }

    function handleSelectionChange() {
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range && selection.toString().length > 0) {
            const parentElement = range.commonAncestorContainer.nodeType === 1 ? 
                                  range.commonAncestorContainer : 
                                  range.commonAncestorContainer.parentNode;
            const computedStyle = window.getComputedStyle(parentElement);

            setBoldActive(computedStyle.fontWeight === 'bold' || computedStyle.fontWeight >= '700');
            setItalicActive(computedStyle.fontStyle === 'italic');
            setUnderlineActive(computedStyle.textDecoration.includes('underline'));
            setStrikeThroughActive(computedStyle.textDecoration.includes('line-through'));

            const textAlign = computedStyle.textAlign;
            setAlignment(textAlign);

            const isOrderedList = document.queryCommandState('insertOrderedList');
            const isUnorderedList = document.queryCommandState('insertUnorderedList');
            setOrderedListActive(isOrderedList);
            setUnorderedListActive(isUnorderedList);

            const linkElement = getSelectedLinkElement();
            setLinkActive(linkElement !== null);       

            setSelectedText(selection.toString());
        } else {
            setBoldActive(false);
            setItalicActive(false);
            setUnderlineActive(false);
            setStrikeThroughActive(false);
            setOrderedListActive(false);
            setUnorderedListActive(false);
            setLinkActive(false);

            setSelectedText('');
        }

        const linkElements = document.querySelectorAll('#write_content a');
        linkElements.forEach((link) => {
            link.setAttribute('target', '_blank');
        });
    }

    function getSelectedLinkElement() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let node = range.startContainer; // Changed from range.commonAncestorContainer
            if (node.nodeType === 3) { // If the node is a text node
                node = node.parentNode;
            }
            while (node) {
                if (node.nodeName === 'A') {
                    return node;
                }
                node = node.parentNode;
            }
        }
        return null;
    }
    
    // Function to handle creating/removing links
    function handleLinkAction() {
        const linkElement = getSelectedLinkElement();
        if (linkElement) {
            // Remove link
            document.execCommand('unlink');
        } else {
            // Create link
            const url = prompt('Enter the URL');
            if (url) {
                document.execCommand('createLink', false, url);
                const newlyCreatedLink = document.querySelector(
                    `#write_content a[href="${url}"]`
                );
            }
        }
        handleSelectionChange();
    }

    function handleLinkClick(event) {
        if (event.target.tagName === 'A') {
            event.preventDefault(); // Prevent default link behavior
            const url = event.target.href;
            window.open(url, '_blank'); // Open link in new tab
        }
    }
    

  return (
    <div className="p-3 w-full flex flex-col justify-center items-center gap-2 shadow-sm border border-solid border-gray-300 bg-white rounded-md group transition-all duration-300 ease-in-out focus-within:shadow-md">
            <div className="flex flex-row gap-2 justify-evenly wrap bg-transparent">
                <button tabIndex="-1" onClick={() => execCommand('bold')} className={`text_editor_btn ${boldActive ? 'text-blue-500' : 'text-gray-500'}`}><FaBold /></button>
                <button tabIndex="-1" onClick={() => execCommand('italic')} className={`text_editor_btn ${italicActive  ? 'text-blue-500' : 'text-gray-500'}`}><FiItalic /></button>
                <button tabIndex="-1" onClick={() => execCommand('underline')} className={`text_editor_btn ${underlineActive  ? 'text-blue-500' : 'text-gray-500'}`}><FiUnderline /></button>
                <button tabIndex="-1" onClick={() => execCommand('strikeThrough')} className={`text_editor_btn ${strikeThroughActive  ? 'text-blue-500' : 'text-gray-500'}`}><GoStrikethrough /></button>
                <button tabIndex="-1" onClick={() => execCommand('justifyLeft')} className={`text_editor_btn ${alignment === 'left' ? 'text-blue-500' : 'text-gray-500'}`}><BsJustifyLeft /></button>
                <button tabIndex="-1" onClick={() => execCommand('justifyCenter')} className={`text_editor_btn ${alignment === 'center' ? 'text-blue-500' : 'text-gray-500'}`}><BsJustify /></button>
                <button tabIndex="-1" onClick={() => execCommand('justifyRight')} className={`text_editor_btn ${alignment === 'right' ? 'text-blue-500' : 'text-gray-500'}`}><BsJustifyRight /></button>
                <button tabIndex="-1" onClick={() => execCommand('insertOrderedList')} className={`text_editor_btn ${orderedListActive ? 'text-blue-500' : 'text-gray-500'}`}><GoListOrdered /></button>
                <button tabIndex="-1" onClick={() => execCommand('insertUnorderedList')} className={`text_editor_btn ${unorderedListActive  ? 'text-blue-500' : 'text-gray-500'}`}><AiOutlineUnorderedList /></button>
                <button tabIndex="-1" onClick={handleLinkAction} className={`text_editor_btn ${linkActive ? 'text-blue-500' : 'text-gray-500'}`}><IoIosLink /></button>
            </div>
            <div className='w-full h-0.5 rounded-full bg-slate-300'></div>
            <div
                ref={editorRef}
                id='write_content'
                contentEditable
                data-placeholder="Enter text here..."
                className="w-full h-full outline-none focus:outline-none "
                onInput={(e) => handleInput(e)}
            />
            
        </div>
  )
}
