import mongoose from "mongoose";

 

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    labels: {
      
        type: [String],
        trim: true,

        default : []
      
  },
    color: {
      type: String,  
      default: "#FFFFFF",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  
  },
  { timestamps: true }
);

const NotesModel =  mongoose.model("Note", notesSchema);

export default NotesModel;


 