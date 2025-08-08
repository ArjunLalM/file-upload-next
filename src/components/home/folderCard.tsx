'use client';

import React, { useState } from 'react';
import { Data } from '@/types/UploadedData';
import { Eye, Trash, Download } from 'lucide-react';
import Image from 'next/image';
import FolderViewCard from './folderViewCard';

type FolderCardProps = {
  item: Data;
  onDelete?: (id: string) => void;
};

const FolderCard: React.FC<FolderCardProps> = ({ item, onDelete }) => {
  const [showForm, setShowForm] = useState(false);

  // Typed parameter
const handleDownload = async (key: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/download/${encodeURIComponent(key)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!res.ok) throw new Error("Failed to download file");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = key;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};



 console.log("FolderCard item:", item);
  return (
    <>
      <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-md shadow-sm hover:shadow transition relative z-0">
        {/* File Icon + Name */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
            <Image src="/file.svg" alt="file" width={24} height={24} />
          </div>
          <div className="flex flex-col truncate">
            <p className="font-medium truncate">{item.title}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            className="text-green-600 hover:text-green-800"
            title="View"
            onClick={() => setShowForm(true)}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDownload(item.s3Key[0])}
            className="text-blue-600 hover:text-blue-800"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete?.(item._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showForm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-lg relative">
      <FolderViewCard item={item} onBack={() => setShowForm(false)} />
    </div>
  </div>
      )}
    </>
  );
};

export default FolderCard;
