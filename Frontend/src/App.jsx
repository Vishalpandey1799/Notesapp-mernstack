import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import useApiStore from "./StoreApi.js/ApiCall";
import { useEffect } from "react";
import PleaseWait from "./components/PleaseWait";
import EditNoteForm from "./Pages/EditNoteForm";

import Otp from "./Pages/Otp";
import ForgotPassword from "./Pages/ForgotPassword";
import NewPassword from "./Pages/NewPassword";

const App = () => {
  const { currentUser, validUser, isLoading } = useApiStore();

  useEffect(() => {
    validUser();
  }, []);

  if (isLoading) {
    return <PleaseWait />;
  }

 

  return (
    <div>
      {currentUser && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!currentUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={currentUser ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route path="/edit/:id" element={<EditNoteForm />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forget-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={<NewPassword/>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
