export const compressImage = async (file: File, maxSizeMB: number = 1): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = width * (MAX_HEIGHT / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Start with quality 0.9 and reduce if needed
                let quality = 0.9;
                const tryCompress = () => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Could not create blob'));
                                return;
                            }

                            const sizeMB = blob.size / (1024 * 1024);

                            if (sizeMB > maxSizeMB && quality > 0.1) {
                                quality -= 0.1;
                                tryCompress();
                            } else {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };

                tryCompress();
            };

            img.onerror = () => reject(new Error('Could not load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Could not read file'));
        reader.readAsDataURL(file);
    });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Formato inválido. Use JPG, PNG ou WebP.'
        };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB before compression
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Arquivo muito grande. Máximo 10MB.'
        };
    }

    return { valid: true };
};
