import  { useEffect } from 'react';

const ClearCookiesOnLoad = () => {
    useEffect(() => {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }, []);

    return null; // This component doesn't render anything
};

export default ClearCookiesOnLoad;