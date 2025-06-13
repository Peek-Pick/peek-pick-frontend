import { useState, useEffect } from 'react';

export function useProfileImageUpload(initialImageUrl: string) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);

    // 파일 변경 시 previewUrl 생성
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const tempUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(tempUrl);
        }
    };

    // 초기 이미지 변경 시 반영
    useEffect(() => {
        setPreviewUrl(initialImageUrl);
    }, [initialImageUrl]);

    return {
        file,
        previewUrl,
        handleFileChange,
    };
}
