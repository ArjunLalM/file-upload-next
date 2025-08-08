"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { uploadFilesAction } from "@/store/FileUpload"; // adjust this import
import { AppDispatch } from "@/store";
import { toast } from "react-toastify";

type FileFormInputs = {
  title: string;
};

const AddFileForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { register, handleSubmit, reset } = useForm<FileFormInputs>();
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const onSubmit = async (data: FileFormInputs) => {
    if (!selectedFiles.length) {
      toast.error("Please select at least one file");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);

    selectedFiles.forEach((file) => {
      formData.append("files", file); // adjust to "files[]" if backend expects array
    });

    try {
      await dispatch(uploadFilesAction(formData)).unwrap();
      toast.success("Files uploaded successfully!");
      reset();
      setSelectedFiles([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        📁 Upload Folder Files
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <TextField
          label="Folder Title"
          variant="outlined"
          fullWidth
          {...register("title")}
        />

        <div>
          <label
            htmlFor="multiple_files"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Select Multiple Files
          </label>
          <input
            id="multiple_files"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full px-4 py-3 text-sm font-medium text-gray-800 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
        >
          Upload Files
        </button>
      </form>
    </div>
  );
};

export default AddFileForm;
