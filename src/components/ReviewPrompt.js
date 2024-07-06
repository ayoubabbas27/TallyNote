import React from 'react';
import Logo from '../images/Logo.png';

const ReviewPrompt = ({ setShowReviewPrompt , onOkay }) => {
    return (
        <div className='review-prompt-container'>
            <div className="review-prompt bg-white rounded-lg flex flex-col justify-center items-center gap-2 p-4">
                <div className='w-full px-3 pb-5 flex flex-col justify-center items-center gap-3'>
                    <img src={Logo} className='w-8 h-auto'/>
                    <div className='w-full flex flex-col justify-center items-center gap-1'>
                        <p className='font-bold text-indigo-500 text-center text-lg'>
                            Would you like to leave a review for TallyNote?
                        </p>
                        <span className='w-full text-sm text-slate-500 px-2 text-center'>
                            Your review helps us keep TallyNote free and improve it for everyone. Thank you for your support!
                        </span>
                    </div>
                </div>
                <div className='w-full flex flex-col justify-center items-center gap-2'>

                    <button 
                        class="py-2 w-full relative inline-flex items-center justify-start overflow-hidden font-medium transition-all ease-in-out bg-indigo-100 rounded-full hover:bg-transparent group "
                        onClick={() => {
                            onOkay();
                            setShowReviewPrompt(false);
                        }}
                    >
                        <span class="w-full h-48 rounded-full bg-indigo-600 absolute bottom-0 left-0 translate-x-full duration-500 transition-all ease-in-out translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                        <span class="relative w-full text-center text-lg text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">Yes, sure</span>
                    </button>

                    <button 
                        className='w-full text-center text-sm bg-transparent text-gray-600 transition-all duration-300 ease-in-out hover:cursor-pointer hover:underline'
                        onClick={() => setShowReviewPrompt(false)}
                    >
                        No, Maybe Later
                    </button>
                    
                </div>
            </div>
        </div>
        
    );
};

export default ReviewPrompt;
