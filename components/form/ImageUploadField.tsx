"use client";

import { useCallback, useState } from "react";

type ImageUploadFieldProps = {
  label?: string;
  error?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
  preview?: string;
};

export default function ImageUploadField({
  label,
  error,
  value,
  onChange,
  onPreviewChange,
  preview,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        return validationError;
      }

      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        onPreviewChange(reader.result as string);
      };
      reader.readAsDataURL(file);
      return null;
    },
    [onChange, onPreviewChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    onPreviewChange("");
  }, [onChange, onPreviewChange]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs text-light-200 uppercase tracking-wider font-semibold">
          {label}
          <span className="text-primary ml-1">*</span>
        </label>
      )}

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/10"
              : error
                ? "border-red-500/50 hover:border-red-500/80"
                : "border-dark-200 hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            id="image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-12 h-12 text-light-200/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-light-100 font-medium">
                {isDragging
                  ? "Drop your image here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-light-200/60">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-[300px] object-cover rounded-xl border border-dark-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
