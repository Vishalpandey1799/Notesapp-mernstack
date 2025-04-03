import { useEffect, useState } from "react";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { Camera, LogOut, Trash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const {
    validUser,
    currentUser,
    LogoutUser,
    accountDelete,
    profileUpdate,
    isProfileUpdating,
  } = useApiStore();
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    validUser();
  }, []);

  if (!currentUser) return null;
 
  const formatName = (name) => {
    if (!name) return "User";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0]} ✦ ${parts.slice(1).join(" ")}`;
    }
    return `☆ ${name} ☆`;
  };
 
  const formatJoinedDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
 
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";

    return `Since ${month} ${day}${suffix}, ${year}`;
  };

  const handleLogout = async () => {
    await LogoutUser();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Please enter your password!");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );

    if (confirmed) {
      await accountDelete(password);
      toast.error("Account deleted!");
      navigate("/signup");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  const handleProfileUpdate = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first!");
      return;
    }

    await profileUpdate(selectedImage);
    setImagePreview(null);
    setSelectedImage(null);
    await validUser();
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto bg-white text-black rounded-lg shadow-xl p-6 mt-10 border border-gray-300 relative">
      {/* Back Button */}
      <button
        className="bg-fuchsia-900 rounded absolute left-[15px] p-3 w-20 top-4 hover:bg-gray-800 text-white"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <div
        className="relative w-24 h-24"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={imagePreview || currentUser.profilePic || "/default-avatar.png"}
          alt="User"
          className="w-24 h-24 rounded-full border-4 border-gray-600 object-cover"
        />

        {hovered && (
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
            <Camera className="text-white w-8 h-8" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </label>
        )}
      </div>

      {imagePreview && (
        <button
          onClick={handleProfileUpdate}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          disabled={isProfileUpdating}
        >
          {isProfileUpdating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Update Profile"
          )}
        </button>
      )}

      <div className="text-center mt-4">
        <p className="text-xl font-semibold text-purple-700">
          {formatName(currentUser.name)}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {formatJoinedDate(currentUser.createdAt)}
        </p>
      </div>

      <div className="w-full mt-6 flex flex-col gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-md transition"
        >
          <Trash className="w-5 h-5" /> Delete Account
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Confirm Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your password to confirm account deletion.
            </p>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-black focus:outline-none focus:ring focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
