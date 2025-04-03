import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useNotesStore from "../StoreApi.js/NotesApi.js";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Archive,
  Pin,
  ChevronDown,
  Filter,
  Plus,
  Edit2,
  Calendar,
  Tag,
} from "lucide-react";
import NoteForm from "./NoteForm";

const Home = () => {
  const navigate = useNavigate();
  const {
    delete_all_Notes,
    isDeleting,
    all_notes,
    archieve_all_notes,
    isArchieve,
    isPinning,
    pin_all_notes,
    allNotes,
    delete_Note,
    archieve_one_Note,
    pin_one_Note,
    isSingleDelete,
    isSingleArchieve,
    isSinglePin,
  } = useNotesStore();

  useEffect(() => {
    all_notes();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All Notes");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) ||
        (filterRef.current && !filterRef.current.contains(event.target))
      ) {
        setIsOpen(false);
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotes = allNotes.filter((note) => {
    if (filter === "Pinned Notes") return note.isPinned;
    if (filter === "Archived Notes") return note.isArchived;
    return true;
  });

  const toggleNoteExpand = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  if (!allNotes) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="bg-gray-800 py-3">
        <div className="px-16 mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Notes</h2>

          <div className="relative sm:hidden" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              Actions <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-700 rounded shadow-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600"
                    onClick={delete_all_Notes}
                  >
                    <Trash2 className="w-5 h-5" />{" "}
                    {isDeleting ? "Please Wait.." : "Delete All"}
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600"
                    onClick={archieve_all_notes}
                  >
                    <Archive className="w-5 h-5" />{" "}
                    {isArchieve ? "Please Wait.." : "Archive All"}
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600"
                    onClick={pin_all_notes}
                  >
                    <Pin className="w-5 h-5" />{" "}
                    {isPinning ? "Please Wait.." : "Pin All"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 flex items-center gap-2"
              onClick={delete_all_Notes}
            >
              <Trash2 className="w-5 h-5" />{" "}
              {isDeleting ? "Please Wait.." : "Delete All"}
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 flex items-center gap-2"
              onClick={archieve_all_notes}
            >
              <Archive className="w-5 h-5" />{" "}
              {isArchieve ? "please wait..." : "Archieve All"}
            </button>
            <button
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-900 flex items-center gap-2"
              onClick={pin_all_notes}
            >
              <Pin className="w-5 h-5" />{" "}
              {isPinning ? "please wait.." : "Pin All"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-16 py-4">
        <button
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 flex items-center gap-2"
          onClick={() => setIsNoteOpen(!isNoteOpen)}
        >
          <Plus className="w-5 h-5" /> Add Note
        </button>

        <div className="relative z-10" ref={filterRef}>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4" />
            {filter} <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg overflow-hidden z-20"
              >
                {["All Notes", "Pinned Notes", "Archived Notes"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600 ${
                        filter === option ? "bg-gray-600" : ""
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative p-6 max-w-md w-full mx-4"
            >
              <NoteForm onClose={() => setIsNoteOpen(false)} />
              <button
                onClick={() => setIsNoteOpen(false)}
                className="absolute bg-black text-amber-100 top-5 right-6 p-3 font-semibold text-xl"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-15 mx-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative p-4 bg-gray-800 rounded-lg shadow-md flex flex-col gap-3"
            >
              <div className="flex gap-3 justify-between">
                <div className="flex gap-2 items-center">
                  <Calendar className="text-fuchsia-600 w-4 h-4" />
                  <span className="text-sm">
                    {new Date(note.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Pin
                    className={`w-5 h-5 cursor-pointer ${
                      note.isPinned
                        ? "text-yellow-400"
                        : "text-gray-500 hover:text-yellow-300"
                    }`}
                    onClick={() => pin_one_Note(note._id)}
                  />
                  <Archive
                    className={`w-5 h-5 cursor-pointer ${
                      note.isArchived
                        ? "text-blue-400"
                        : "text-gray-500 hover:text-blue-300"
                    } ${isSingleArchieve && "animate-spin"}`}
                    onClick={() => archieve_one_Note(note._id)}
                  />
                  <Edit2
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300"
                    onClick={() => navigate(`/edit/${note._id}`)}
                  />
                  <Trash2
                    className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-500"
                    onClick={() => delete_Note(note._id)}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold">{note.title}</h3>

              <div className="flex flex-wrap gap-2">
                {note.labels?.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                  >
                    <Tag className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>

              <p
                className={`text-gray-300 cursor-pointer ${
                  expandedNoteId === note._id
                    ? "whitespace-pre-line"
                    : "line-clamp-3"
                }`}
                onClick={() => toggleNoteExpand(note._id)}
              >
                {note.content}
                {!expandedNoteId && note.content.length > 150 && (
                  <span className="text-blue-400 ml-1">...see more</span>
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
