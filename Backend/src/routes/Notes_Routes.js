
import express from "express"

const router = express.Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import {  allNotes, archiveAll, archiveNote, createNotes, deleteAll, deleteNotes, editNotes, pinAllNotes, pinNote, SearchNotes } from "../controllers/noteController.js";
 

router.post("/create/notes" , authMiddleware , createNotes)
router.delete("/delete/notes/:noteId" , authMiddleware , deleteNotes);
router.put("/edit/notes/:noteId" , authMiddleware , editNotes)
router.delete("/delete/all" , authMiddleware , deleteAll)
router.put("/archiev/:notesId" , authMiddleware , archiveNote)
router.put("/pinned/:notesId" , authMiddleware , pinNote)
router.put("/pinallnotes" , authMiddleware , pinAllNotes)
router.get("/allNotes" , authMiddleware , allNotes)
router.put("/archieve/all" , authMiddleware , archiveAll)
router.get("/SearchNotes" , authMiddleware , SearchNotes)
 

export default router;