import { create } from "zustand";
import { axiosNotesInstance } from "../utils/Axios_Notes.js";
import toast from "react-hot-toast";
 

const useNotesStore = create((set, get) => ({
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  allNotes: [],
  isFetching: false,
  isArchieve: false,
  isPinning: false,
  isSingleDelete : false,
  isSingleArchieve : false,
  isSinglePin : false,
  isEditing : false,
  searchItem : [],

  createNote: async (data) => {
    try {
      set({ isCreating: true });
      let response = await axiosNotesInstance.post("/create/notes", data);
   
      toast.success("Notes created");

      await get().all_notes(); 
      set({ isCreating: false });
    } catch (error) {
      set({ isCreating: false });
       
      toast.error(error.response?.data?.message || "Failed to create note");
    }
  },

  delete_all_Notes: async () => {
    try {
      set({ isDeleting: true });
      await axiosNotesInstance.delete("/delete/all");
      toast.success("All Notes Wiped out!");

      await get().all_notes(); 
      set({ isDeleting: false });
    } catch (error) {
      set({ isDeleting: false });
    
      toast.error(error.response?.data?.message || "Error deleting notes");
    }
  },

  all_notes: async () => {
    try {
      set({ isFetching: true });
      const response = await axiosNotesInstance.get("/allNotes");
      set({ 
        allNotes: response.data?.Notes || [], 
        isFetching: false 
      });

      if (!response.data?.Notes?.length) {
        toast.error("No notes found");
      }
      return response.data?.Notes || [];
    } catch (error) {
      set({ isFetching: false });
      toast.error(error.response?.data?.message || "Error fetching notes");
      return [];
    }
  },
  
  archieve_one_Note : async(notesId) =>{
     try {
      set({isSingleArchieve : true})
       const response = await axiosNotesInstance.put(`/archiev/${notesId}`)
       toast.success(response?.data?.message)
      set({isSingleArchieve : false})

       await get().all_notes()

     } catch (error) {
      set({isSingleArchieve : false})
 
      toast(error.response?.data?.message || "kisi ko btana nhi !!")
     }
  },
  archieve_all_notes: async () => {
    try {
      set({ isArchieve: true });
      const response = await axiosNotesInstance.put("/archieve/all");
 
      toast.success(response?.data?.message);

      await get().all_notes(); 
      set({ isArchieve: false });
    } catch (error) {
      set({ isArchieve: false });
     
      toast.error(error.response?.data?.message || "Error archiving notes");
    }
  },
 
  pin_one_Note : async (notesId) =>{
    try{
      set({isSinglePin : true})
    const response = await axiosNotesInstance.put(`/pinned/${notesId}`)
    toast.success(response?.data?.message)
    set({isSinglePin : false})
    await get().all_notes()

    }catch(error){
    set({isSinglePin : false})
     
      toast.error(error.response?.data?.message)
    }
  },
  pin_all_notes: async () => {
    try {
      set({ isPinning: true });
      const response = await axiosNotesInstance.put("/pinallnotes");
      toast.success(response?.data?.message);
    

      await get().all_notes(); 
      set({ isPinning: false });
    } catch (error) {
      set({ isPinning: false });
     
      toast.error(error.response?.data?.message || "Error pinning notes");
    }
  },

  delete_Note : async(id) =>{
    try {
      await axiosNotesInstance.delete(`/delete/notes/${id}`)
      toast.success("Note Deleted !")
      await get().all_notes()
    } catch (error) {
  
      toast.error(error.response?.data?.message)
    }
  },

  edit_Note : async(notesId,data) =>{
    try {
      set({isEditing : true})
      const response = await axiosNotesInstance.put(`/edit/notes/${notesId}`,data)
 
      set({isEditing:false})
    } catch (error) {
     
      toast.error(error.response?.data?.message)
    }
  },

  SearchNotes: async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        
        await get().all_notes();
        return get().allNotes;
      }

      const response = await axiosNotesInstance.get("/searchNotes", {
        params: {
          search: searchTerm
        }
      });

      
      set({ allNotes: response.data || [] });
      return response.data || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching notes");
      set({ allNotes: [] });
      return [];
    }
  },
 

}));

export default useNotesStore;


 