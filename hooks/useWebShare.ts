
import { useState, useEffect } from 'react';
import { useToast } from './useToast';

// Helper function to convert data URL to File object
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File | null> {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        return null;
    }
}

export const useWebShare = (text: string, imageUrl: string | null, fileName: string) => {
    const { addToast } = useToast();
    const [isShareSupported, setIsShareSupported] = useState(false);
    const [canShareFiles, setCanShareFiles] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setIsShareSupported(true);
            // Check if files can be shared
            if (navigator.canShare && navigator.canShare({ files: [new File([], "test.jpg", {type: "image/jpeg"})] })) {
                setCanShareFiles(true);
            }
        }
    }, []);

    const share = async () => {
        if (!navigator.share) {
            addToast('Web Share is not supported by your browser.', 'error');
            return;
        }

        const shareData: ShareData = {
            title: 'Realiste AI Property Post',
            text: text,
        };
        
        let fileToShare: File | null = null;
        if (imageUrl && canShareFiles) {
             fileToShare = await dataUrlToFile(imageUrl, fileName);
             if (fileToShare) {
                shareData.files = [fileToShare];
             }
        }

        try {
            await navigator.share(shareData);
        } catch (error) {
            // Log error but don't bother user unless it's an AbortError
            if ((error as DOMException).name !== 'AbortError') {
                 console.error('Error sharing:', error);
                 addToast('An error occurred while trying to share.', 'error');
            }
        }
    };
    
    // Only enable full share if files are supported and an image exists
    const canSharePostAndImage = isShareSupported && canShareFiles && !!imageUrl;

    return { share, isSupported: canSharePostAndImage };
};
