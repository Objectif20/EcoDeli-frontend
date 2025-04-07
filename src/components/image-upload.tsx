import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadIcon, XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export const ImageUpload = ({ maxFiles = 5, onImagesChange }: { maxFiles?: number; onImagesChange?: (images: File[]) => void }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = [...images, ...acceptedFiles].slice(0, maxFiles);
    console.log('Files dropped:', acceptedFiles); 
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    console.log('Removing image at index:', index); 
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  useEffect(() => {
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    console.log('Creating object URLs:', objectUrls);
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      console.log('Revoking object URLs:', objectUrls); 
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles,
    onDrop,
  });

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className={cn(
          'relative h-auto w-full flex flex-row overflow-auto p-8 border border-dashed',
          isDragActive && 'ring-1 ring-ring'
        )}
      >
        {/* Preview */}
        {previews.map((src, index) => (
          <div key={index} className="relative w-32 h-32 mr-2">
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => removeImage(index)}
            >
              <XIcon size={12} />
            </button>
          </div>
        ))}
        {/* Dropzone */}
        <div
          className="h-32 w-32 flex items-center justify-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            className="h-full w-full flex items-center justify-center"
          >
            <UploadIcon size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};
