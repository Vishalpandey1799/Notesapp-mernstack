import { useState } from "react";
import { Plus } from "lucide-react";
import useNotesStore from "../StoreApi.js/NotesApi.js";

const NoteForm = () => {
  const { createNote, isCreating } = useNotesStore();
  const [notes, setNotes] = useState({
    title: "",
    content: "",
    labels: [],
  });
  const [newLabel, setNewLabel] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotes({
      ...notes,
      [name]: value,
    });
  };

  const addLabel = () => {
    if (newLabel.trim() && !notes.labels.includes(newLabel)) {
      setNotes({
        ...notes,
        labels: [...notes.labels, newLabel],
      });
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove) => {
    setNotes({
      ...notes,
      labels: notes.labels.filter((label) => label !== labelToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNote(notes);
    console.log("Submitted note:", notes);
  };

  const labelColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
  ];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Note</h1>
      <p className="text-gray-600 mb-6">Organize your thoughts and ideas</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Note Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter a catchy title..."
            onChange={handleChange}
            value={notes.title}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Thoughts
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your note content here..."
            onChange={handleChange}
            value={notes.content}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-black"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="newLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags/Labels
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="newLabel"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add tags (e.g., important, work)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
            />
            <button
              type="button"
              onClick={addLabel}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
            >
              <Plus />
            </button>
          </div>

          {/* Display Labels */}
          <div className="flex flex-wrap gap-2 mt-3">
            {notes.labels.map((label, index) => (
              <span
                key={label}
                className={`${
                  labelColors[index % labelColors.length]
                } px-3 py-1 rounded text-sm flex items-center gap-1`}
              >
                {label}
                <button
                  type="button"
                  onClick={() => removeLabel(label)}
                  className="text-xs hover:text-gray-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md"
        >
          {isCreating ? "Creating..." : "Save Now"}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
