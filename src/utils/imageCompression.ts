/**
 * Utilitário para compressão e otimização de imagens
 * Reduz tamanho de imagens em 70-90% antes do upload
 */

export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.0 a 1.0
    outputFormat?: 'webp' | 'jpeg' | 'png';
}

/**
 * Comprime uma imagem mantendo a proporção
 * @param file - Arquivo de imagem original
 * @param options - Opções de compressão
 * @returns Promise<File> - Imagem comprimida
 */
export async function compressImage(
    file: File,
    options: ImageCompressionOptions = {}
): Promise<File> {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.85,
        outputFormat = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calcular novas dimensões mantendo proporção
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;

                    if (width > height) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                // Criar canvas para redimensionar
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Desenhar imagem redimensionada
                ctx.drawImage(img, 0, 0, width, height);

                // Converter para blob com compressão
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // Criar novo arquivo com nome original
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^/.]+$/, `.${outputFormat}`),
                            {
                                type: `image/${outputFormat}`,
                                lastModified: Date.now()
                            }
                        );

                        resolve(compressedFile);
                    },
                    `image/${outputFormat}`,
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Comprime múltiplas imagens
 */
export async function compressImages(
    files: File[],
    options: ImageCompressionOptions = {}
): Promise<File[]> {
    return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Valida se um arquivo é uma imagem válida
 */
export function validateImage(file: File, maxSizeBytes: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Arquivo deve ser uma imagem' };
    }

    // Verificar tamanho (antes da compressão)
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `Imagem muito grande. Máximo ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB`
        };
    }

    return { valid: true };
}

/**
 * Exemplo de uso:
 * 
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (!file) return;
 * 
 *   // Validar
 *   const validation = validateImage(file);
 *   if (!validation.valid) {
 *     alert(validation.error);
 *     return;
 *   }
 * 
 *   // Comprimir
 *   const compressedFile = await compressImage(file, {
 *     maxWidth: 800,
 *     maxHeight: 800,
 *     quality: 0.85,
 *     outputFormat: 'webp'
 *   });
 * 
 *   console.log('Tamanho original:', (file.size / 1024).toFixed(2), 'KB');
 *   console.log('Tamanho comprimido:', (compressedFile.size / 1024).toFixed(2), 'KB');
 *   console.log('Redução:', ((1 - compressedFile.size / file.size) * 100).toFixed(1), '%');
 * 
 *   // Upload para Supabase
 *   await uploadToSupabase(compressedFile);
 * };
 */
