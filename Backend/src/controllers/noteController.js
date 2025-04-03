 
import NotesModel from "../Models/Notes.js";
 


export const createNotes = async(req,res) =>{
 
 

    try{
        if(!req.user){
            return res.status(404).json({success : false , message : "Unauthorized User"}) 
        }

       
        const {title , content,labels} = req.body;
      
    
        if(!title || !content || !labels){
            return res.status(404).json({success : true , message : "All Field Are Required"})
        }
    
        const newNotes = await NotesModel.create({
            user : req.user.id,
            title,
            content,
            labels,

            
        });
    
        await newNotes.save();
    
        res.status(200).json({success : true , message : "Note Created ! " , newNotes})
        
    }catch(error){
        console.log("error from createnotes....")
        res.status(500).json({success : false , message : "Something went wrong !" , reason : error.message})
    }
    

    
}

export const deleteNotes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { noteId } = req.params;

        console.log(noteId)

        if (!noteId) {
            return res.status(400).json({ success: false, message: "Note ID is required" });
        }

        const is_Note_exists = await NotesModel.findById(noteId);
        if (!is_Note_exists) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        if (String(req.user.id) !== String(is_Note_exists.user)) {
            return res.status(403).json({ success: false, message: "Access Denied!" });
        }

        const deletedNote = await NotesModel.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(500).json({ success: false, message: "Failed to delete note" });
        }

        res.status(200).json({ success: true, message: "Note deleted successfully!" });

    } catch (error) {
        console.error("Error from deleteNotes:", error);
        res.status(500).json({ success: false, message: "Something went wrong", reason: error.message });
    }
};


export const editNotes = async(req,res) =>{
    try {
        if(!req.user){
            return res.status(401).json({success : false , message : "Unauthorized !"})
        }

        const {noteId} = req.params;
        console.log(noteId)
        const {title , content , labels} = req.body;

        if(!noteId){
            return res.status(400).json({success : false , message : "Notes id is required"})
        }
        const existing_user = await NotesModel.findById(noteId);
        if(req.user.id !== existing_user.user.toString()){
            return res.status(401).json({success : false , message : "Access Denied"})
        }

        if(!existing_user){
            return res.status(404).json({success : false , message : "Nothing Found !"})
        }

        await NotesModel.findByIdAndUpdate(
            noteId, 
            {
                title : title === "" ? existing_user.title :  title,
                content : content === "" ? existing_user.content :  content,
                labels :  labels === "" ? existing_user.labels :  labels,
            },
            { new: true }
        );
        
        res.status(200).json({success : true , message : "Notes Updated !"})


        if(!noteId){
            return res.status(400).json({success : false , message : "Notes id is required !"})
        }

    } catch (error) {
        console.log("error from editnotes" , error)
        return res.status(500).json({success : false , message : "Something went wrong !" , reason : error.message})
    }
}

export const deleteAll = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

 
        const userid = req.user.id;

        if (!userid) {
            return res.status(403).json({ success: false, message: "Access Denied!" });
        }

         
        const existing_Tasks = await NotesModel.find({ user: userid });

        if (existing_Tasks.length === 0) {
            return res.status(400).json({ success: false, message: "Create Notes " });
        }
 
        await NotesModel.deleteMany({ user: userid });

        return res.status(200).json({ success: true, message: "All notes deleted successfully!" });

    } catch (error) {
        console.error("Error from deleteAll:", error);
        return res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};


export const archiveNote = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const { notesId } = req.params;

        if (!notesId) {
            return res.status(400).json({ success: false, message: "Notes ID is required" });
        }

        const existing_notes = await NotesModel.findById(notesId);

        if (!existing_notes) {
            return res.status(404).json({ success: false, message: "Note not found!" });
        }

        if (req.user.id !== existing_notes.user.toString()) {
            return res.status(403).json({ success: false, message: "Access denied!" });
        }

        existing_notes.isArchived = !existing_notes.isArchived;
        await existing_notes.save();

        res.status(200).json({
            success: true,
            message: `Note ${existing_notes.isArchived ? "Archieved" : "Unarchieved"} Successfully !`,
            updated: existing_notes,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};


export const archiveAll = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const userId = req.user.id;

        const userNotes = await NotesModel.find({ user: userId });
     
     

        if (userNotes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found to archive!" });
        }

        const is_All_Archieve = userNotes.every(note => note.isArchived)

        if(is_All_Archieve){
            await NotesModel.updateMany(
                { user: userId },
                { isArchived: false }
            );

            return res.status(200).json({
                "success" : false , 
                "message" : "Unarchieve Succcessfull"


            })
        }

        await NotesModel.updateMany(
            { user: userId },
            { isArchived: true }
        );

        res.status(200).json({
            success: true,
            message: "All your notes archived successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};

export const pinNote = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const { notesId } = req.params;

        if (!notesId) {
            return res.status(400).json({ success: false, message: "Notes ID is required" });
        }

        const note = await NotesModel.findById(notesId);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found!" });
        }

        if (req.user.id !== note.user.toString()) {
            return res.status(403).json({ success: false, message: "Access denied!" });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        res.status(200).json({
            success: true,
            message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
            note,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};


export const pinAllNotes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }

        const userId = req.user.id;

        const allnotes = await NotesModel.find({user: userId})
    

        if(allnotes.length===0){
            return res.status(404).json({success : false , message : "Nothing to pin"})
        }

        const is_All_Pinned = allnotes.every(note => note.isPinned)

        if(is_All_Pinned){
            return res.status(200).json({success : false , message : "Already Pinned !"})
        }
    
    
        await NotesModel.updateMany(
            { user: req.user.id, isPinned: false }, 
            { isPinned: true }
        );

       

        res.status(200).json({
            success: true,
            message: "All your notes have been pinned successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};

export const allNotes = async(req,res) =>{
    if(!req.user){
        return res.status(404).json({success : false , message : "Unauthorized User !"})
    }

    const loginId = req.user.id;

    const allNotes = await NotesModel.find({user : loginId})
    
    .sort({
        isPinned : -1 ,createdAt : -1
    }).lean()
 

    if(allNotes.length===0){
        return res.status(404).json({success : false , message : "Nothing found"})
    }

    res.status(200).json({success : true , message : "All Notes found" , Notes : allNotes})
}
 
export const SearchNotes = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
  
      const loginUser = req.user.id;
      const { search } = req.query; 

       
  
      if (!search || typeof search !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Invalid search query"
        });
      }
  
    
      const searchRegex = new RegExp(search, 'i');
   
      const notes = await NotesModel.find({
        user: loginUser,
        $or: [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { labels: { $in: [searchRegex] } }
        ]
      });
  
      console.log(notes)
      if (notes.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No notes found matching your criteria"
        });
      }
  
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error searching notes:", error);
      res.status(500).json({ 
        success: false,
        error: "Server error while searching notes" 
      });
    }
}

