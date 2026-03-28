"use client";

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const ImageUpload = ({ onFileSelect }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10 MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50">
        <img src={preview} alt="Uploaded barrier photo" className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-foreground/20 flex items-end">
          <div className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm flex items-center justify-between">
            <span className="text-xs text-foreground font-medium truncate max-w-[70%]">
              <ImageIcon className="w-3 h-3 inline mr-1.5 text-green-600" />
              {fileName}
            </span>
            <button
              onClick={handleClear}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
        dragOver
          ? 'border-accent bg-accent/5 scale-[1.01]'
          : 'border-border bg-secondary/30 hover:border-accent/50 hover:bg-secondary/50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      aria-label="Upload barrier photo"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${dragOver ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
        {dragOver ? <UploadCloud className="w-7 h-7" /> : <Camera className="w-7 h-7" />}
      </div>
      <p className="text-sm font-semibold text-foreground">
        {dragOver ? 'Drop to upload' : 'Upload a photo'}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Drag & drop or click to browse · PNG, JPG up to 10MB
      </p>
    </div>
  );
};

export default ImageUpload;