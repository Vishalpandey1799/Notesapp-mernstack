import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const { VerifyUser } = useApiStore();

  const [otp, setOtp] = useState("");
  const [minute, setMinute] = useState(1);
  const [seconds, setSeconds] = useState(59);
  const [isActive, setIsActive] = useState(true);

  const startTimer = () => {
    setMinute(1);
    setSeconds(59);
    setIsActive(true);
  };

  useEffect(() => {
    if (!email) {
      toast.error("Bht marunga phle sign up karle ");
      navigate("/signup");
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          if (minute > 0) {
            setMinute((prevMinute) => prevMinute - 1);
            return 59;
          } else {
            clearInterval(timer);
            setIsActive(false);
            return 0;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, minute]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length > 6) {
      return toast.error("Incorrect OTP");
    }

    if (!otp) {
      return toast.error("Please enter the OTP");
    }

    await VerifyUser(email, otp);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-700 h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Verify OTP
        </h2>

        <div className="flex items-center flex-col mb-5">
          <p className="font-semibold font-mono text-gray-800">
            Check your email
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="otp" className="text-gray-800 font-medium">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Time Remaining: {minute}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>

            <button
              type="button"
              className="bg-gradient-to-r from-gray-800 to-fuchsia-800 p-2 rounded text-white transition-all duration-300 hover:brightness-150 hover:shadow-lg"
              onClick={startTimer}
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-950 to-fuchsia-800 rounded w-full py-3 text-white font-serif transition-all duration-300 hover:brightness-150 hover:shadow-lg mt-4"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
