
import { useState } from 'react';
import { Link } from "@remix-run/react";
import { IoClose } from "react-icons/io5";


export function NotifNew()  {
    const [show, setShow] = useState(true);
    const [minimized, setMinimized] = useState(false);

    const handleClose = () => {
        setShow(false);
        setMinimized(true);
    };

    const handleRestore = () => {
        setShow(true);
        setMinimized(false);
    };

    // Minimized indicator at bottom
    if (minimized) {
        return (
            <button 
                className="fixed bottom-4 left-4 z-99999 cursor-pointer"
                onClick={handleRestore}
                aria-label="Restore notification"
            >
                <div className="flex items-center gap-2 py-2 px-3 border-2 border-black bg-yellow-200 rounded-lg shadow-[4px_4px_0px_-1px_#000000] hover:shadow-[6px_6px_0px_-1px_#000000] transition-all">
                    <img
                        src="/icon/ep-caution.svg"
                        alt="Notification Icon"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                    />
                    <span className="text-sm font-bold text-black">New Update</span>
                </div>
            </button>
        );
    }

    if (!show) return null;

    return (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-99999 flex items-top gap-4 py-3 px-4 border-4 border-black bg-yellow-200 rounded-br-[50px] shadow-[17px_16px_0px_-1px_#000000] max-w-md">
            <img
                src="/icon/ep-caution.svg"
                alt="Notification Icon"
                width={24}
                height={24}
                className="w-6 h-6"
            />

            {/* Content */}
            <div className="flex flex-col text-black">
                <h4 className="font-bold">New Update Available</h4>
                <p className='leading-tight w-64 mt-2'>Check The New Revamp Update of Peter shaan portofolio</p>
                <Link to="https://petershaan.net" className="font-bold hover:underline mt-2">
                    visit
                </Link>
            </div>

            {/* Close Button */}
            <IoClose
                className="absolute top-3 right-4 w-6 h-6 font-bold cursor-pointer text-black"
                onClick={handleClose}
            />
        </div>
    );
};
