
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit"
import axios from "axios"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import qs from "qs";
export interface UploadState {
    data : [], 
     searchResult: [],
    params: any,
    uploadData : any 
    loading : boolean,
    isRefresh: boolean
    error : string | null
    totalUploads: number;
    bookedCount: number;
}

const initialState: UploadState = {
    data: [],
     searchResult: [],
    params: {},
    uploadData : {},
    loading: false,
    isRefresh: false,
    totalUploads: 0,
      bookedCount: 0,
    error: ""
}

interface Redux {
    getState : any,
    dispatch : Dispatch<any>
}

// addTours 
export const uploadFilesAction = createAsyncThunk(
    'file/addFile',
    async (data: any , { }: Redux) => {
    const storedToken = localStorage.getItem('token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "content-type": "multipart/form-data"
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/upload`, data, headers)
     console.log(response.data)
    return response.data
   
  },
)

export const ListFilesAction  = createAsyncThunk(
  'file/listFile',
  async (data: any, {}: Redux) => {
    const storedToken = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/myfiles`,
      data,
      headers
    );

    return response.data.data;
  }
);


//Delete 
// store/FileUpload.ts
export const deleteFileAction = createAsyncThunk(
  'file/fileDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/file/delete/${id}`,
        headers
      );
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Delete failed');
    }
  }
);


export const fileUploadSlice  = createSlice({
  name: 'file',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
 // Reducers for add files
    .addCase(uploadFilesAction.fulfilled, (state) => {
        state.loading = false
        state.error = ""
        state.isRefresh = false;
    })
    .addCase(uploadFilesAction.pending, (state) => {
        state.loading = true
        state.isRefresh = true;
    })
    .addCase(uploadFilesAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.isRefresh = false;
        state.error = action.payload
    })
    //Delete file
    .addCase( deleteFileAction.fulfilled, (state) => {
      state.loading = false;
      state.isRefresh = false;
      state.error = "";
    })
    .addCase( deleteFileAction.pending, (state) => {
      state.loading = true;
      state.isRefresh = true;
    })
    .addCase( deleteFileAction.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.isRefresh = false;
    })
    //List files
     .addCase(ListFilesAction.fulfilled,  (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
       state.data = action.payload
    })
    .addCase(ListFilesAction.pending, (state) => {
        state.loading = true
       
    })
    .addCase(ListFilesAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    
    
      },
})


export default fileUploadSlice .reducer;