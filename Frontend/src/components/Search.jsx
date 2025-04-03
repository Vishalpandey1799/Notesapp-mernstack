import { SearchIcon } from "lucide-react";
import { useState } from "react";
import useNotesStore from "../StoreApi.js/NotesApi.js";

const Search = () => {
  const [search, setSearch] = useState("");
  const { SearchNotes } = useNotesStore();
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      await SearchNotes(search);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      className="border border-white flex items-center rounded-lg overflow-hidden px-2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Search your notes..."
        className="px-4 py-2 w-full outline-none text-white placeholder-gray-500 bg-transparent"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        disabled={isSearching}
        className="text-white hover:text-gray-300 transition-colors"
      >
        {isSearching ? (
          <span className="animate-pulse">Searching...</span>
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
      </button>
    </form>
  );
};

export default Search;
