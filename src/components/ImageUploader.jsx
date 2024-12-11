import React from 'react';

const ImageUploader = ({
  label = "Sube una imagen",
  description = "Máximo 0.5 MB",
  accept = "image/*",
  onImageChange,
  imagen,
  error,
  imagenKey,
}) => {
  return (
    <div className="relative">
      <label
        title="Click to upload"
        htmlFor="imageUploader"
        className="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
      >
        <div className="w-max relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-image"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <div className="relative">
          <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
            {label}
          </span>
          <span className="mt-0.5 block text-sm text-gray-500">{description}</span>
          {imagen && (
            <span className="mt-0.5 block text-sm text-gray-500">
              {imagen.name} ({(imagen.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          )}
          {error && (
            <span className="mt-0.5 block text-sm text-red-500">{error}</span>
          )}
        </div>
      </label>
      <input
        type="file"
        id="imageUploader"
        className="hidden"
        accept={accept}
        onChange={onImageChange}
        key={imagenKey}
      />
    </div>
  );
};

export default ImageUploader;
