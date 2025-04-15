"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

const HIDE_POPUP_TIMESTAMP_KEY = 'hideRecruitmentPopupUntil';

export default function JobPostingsPopup() {
    const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
        width: undefined,
        height: undefined,
    });
    const [dontShowToday, setDontShowToday] = useState(false);
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const storedTimestamp = localStorage.getItem(HIDE_POPUP_TIMESTAMP_KEY);
        if (storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10);
            const now = new Date().getTime();

            if (now < timestamp) {
                setShowPopup(false);
                window.close();
            }
        }

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const setHideForToday = () => {
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const expiryTimestamp = endOfToday.getTime();
        localStorage.setItem(HIDE_POPUP_TIMESTAMP_KEY, expiryTimestamp.toString());
    };

    const handleApply = () => {
        if (window.opener && window.opener.location) {
            window.opener.location.href = "/company/recruitment";
        }
        window.close();
    };

    const handleCheckboxChange = (e: any) => {
        const isChecked = e.checked || false;
        setDontShowToday(isChecked);

        if (isChecked) {
            setHideForToday();
            window.close();
        }
    };

    const divStyle = windowSize.width !== undefined && windowSize.height !== undefined
        ? { width: windowSize.width, height: windowSize.height }
        : { width: '100vw', height: '100vh' };

    if (!showPopup) return null;

    return (
        <div
            className="relative w-full h-screen overflow-hidden"
            style={divStyle}
        >
            <div className="absolute inset-0" style={{ zIndex: 1 }}>

                <Image src="/popup_poster/poster.png" alt="Job Posting" fill style={{ objectFit: "cover" }} priority />
            </div>

            <div className="inset-x-0 bottom-0 flex justify-content-center align-items-center end h-9 pb-16 sm:pb-20"
                style={{
                    height: '86vh',
                    paddingBottom: '4rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'end',
                }}>
                <Button
                    onClick={handleApply}
                    className="hover:bg-white/10 text-white border-2 border-white px-8 py-6 text-lg font-medium"
                    style={{ backgroundColor: '#F68E1E', border: 'none' }}
                >
                    Apply now
                </Button>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center px-3 py-2 rounded bg-black/30" style={{ zIndex: 100, marginLeft: '0.5rem' }}>
                <Checkbox
                    inputId="dontShowToday"
                    checked={dontShowToday}
                    onChange={handleCheckboxChange}
                />

                <span
                    className="ml-2 text-sm cursor-pointer"
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                        position: 'relative',
                        zIndex: 101,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        marginLeft: '0.5rem',
                    }}>
                    Don't show this again today
                </span>
            </div>
        </div>
    );
}