'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Data } from '@/types/UploadedData';

interface FolderViewCardProps {
  item: Data;
  onBack: () => void;
}

const FolderViewCard: React.FC<FolderViewCardProps> = ({ item, onBack }) => {
  const fileUrl = item.files?.[0] || '';  // ✅ FIXED here
  const isValidSrc = fileUrl.trim() !== '';
  const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

  const renderPreview = () => {
    if (!isValidSrc) {
      return <p className="text-gray-500">No preview available</p>;
    }

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExtension!)) {
      return (
     <div className="relative bg-white rounded-lg shadow-md w-full h-full">
        <Image
          src={fileUrl}
          alt={item.title}
          fill
          className="object-contain"
        />
      </div>
      );
    }

    if (fileExtension === 'pdf') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full rounded-md"
          title="PDF Preview"
        />
      );
    }

    return <p className="text-gray-500">Preview not supported for this file type.</p>;
  };

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(item.createdAt));

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-70">
  <div className="relative p-6 rounded-xl shadow-md bg-white w-full h-full flex flex-col">
    {/* Close Button */}
    <button
      onClick={onBack}
      className="absolute top-3 right-3 text-gray-500 hover:text-black"
      title="Close"
    >
      <X size={24} />
    </button>

    {/* File Preview - take most space */}
    <div className="flex-1 flex items-center justify-center overflow-auto mt-4">
      {renderPreview()}
    </div>

    {/* File Details */}
    <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-700">
      <p><strong>Title:</strong> {item.title}</p>
      <p><strong>Created At:</strong> {formattedDate}</p>
    </div>
  </div>
</div>

  );
};

export default FolderViewCard;
