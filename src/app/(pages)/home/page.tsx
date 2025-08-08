'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Add, Close, Logout } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import AddFileForm from "@/components/home/addFileForm";
import FolderCard from "@/components/home/folderCard";
import {ListFilesAction,deleteFileAction } from '@/store/FileUpload'
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux'
import { Data } from '@/types/UploadedData'
const Home = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false); 
 

  const useAppDispatch = useDispatch.withTypes<AppDispatch>();
  const useAppSelector = useSelector.withTypes<RootState>();
  const dispatch = useAppDispatch()
  const store : Data[] =useAppSelector((state) => state.file.data)
  const isLoading = useAppSelector((state) => state.file.isRefresh)

  useEffect(() => {
    dispatch(ListFilesAction({}))
  }, [dispatch,isLoading])

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!', { autoClose: 2000 });
    setTimeout(() => router.push('/login'), 2000);
  };
  

  const handleDeleteFolder = async (id: string) => {
  try {
    await dispatch(deleteFileAction(id));
    toast.success("File deleted successfully");
    dispatch(ListFilesAction({})); // Refresh list
  } catch (error) {
    toast.error("Failed to delete file");
    console.error(error);
  }
};

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
     <div className="bg-white p-4 shadow-md flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between sm:items-center">
  <Button
    variant={showForm ? 'outlined' : 'contained'}
    color="primary"
    startIcon={showForm ? <Close /> : <Add />}
    onClick={toggleForm}
    className="w-full sm:w-auto"
  >
    {showForm ? 'Close Form' : 'Add File'}
  </Button>

  <Button
    variant="outlined"
    color="error"
    endIcon={<Logout />}
    onClick={handleLogout}
    className="w-full sm:w-auto"
  >
    Logout
  </Button>
</div>

      
   <div className="p-6 space-y-6">
        {showForm && <AddFileForm />}

        {/* Folder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

       {Array.isArray(store) &&store.map((item: Data, index: number) => (
            <FolderCard key={index} item={item} onDelete={handleDeleteFolder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;