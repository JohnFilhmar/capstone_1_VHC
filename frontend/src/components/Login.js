import { useContext, useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import useQuery from "../hooks/useQuery";
import { Spinner } from "flowbite-react";
import useCurrentTime from "../hooks/useCurrentTime";
import { colorTheme, notificationMessage } from "../App";
import { useLocation } from "react-router-dom";
import quotes from "../health_quotes.json";
import Header from "./MainContent/Header";
import { BiLogInCircle } from "react-icons/bi";

const Login = () => {
  const { mysqlTime } = useCurrentTime();
  const [selectedTheme] = useContext(colorTheme);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const { isLoading, userAuth } = useQuery();
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [quote, setQuote] = useState({});
  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });
  const [warning, setWarning] = useState(null);
  
  const location = useLocation();

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    generateRandomQuote();
    if (String(location.pathname).substring(1) === "login/validemail") {
      setNotifMessage(
        "Email Successfully Validated. You can now login with your credentials."
      );
    }
    const time = setTimeout(() => {
      setNotifMessage(null);
    }, 5000);
    return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayload = {
      ...payload,
      dateTime: String(mysqlTime),
    };
    userAuth(newPayload);
    setPayload({
      username: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (payload.password.length > 2) {
      validatePasswordStrength(payload.password);
    } else {
      setWarning(null);
    }
  }, [payload.password]);

  function validatePasswordStrength(password) {
    const missingConditions = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength) {
      setWarning(null);
      return true;
    } else {
      if (!hasUpperCase) missingConditions.push("an uppercase letter");
      if (!hasLowerCase) missingConditions.push("a lowercase letter");
      if (!hasNumber) missingConditions.push("a number");
      if (!hasSpecialChar) missingConditions.push("a special character");
      if (!isValidLength) missingConditions.push("at least 8 characters in length");
      setWarning(`Password must contain: ${missingConditions.join(", ")}.`);
    }
    return false;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={"Login"} icon={<BiLogInCircle />} />
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-between items-center h-full">
            <form
              onSubmit={handleSubmit}
              className={`relative flex flex-col justify-center items-center gap-4 bg-${selectedTheme}-50 rounded-lg basis-1/2 h-full p-4 w-full`}
            >
              <p
                className={`text-xl md:text-2xl lg:text-3xl text-${selectedTheme}-800 font-normal`}
              >
                Login Here
              </p>
              <div className="flex justify-center items-center gap-2 w-full">
                <input
                  required
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username. . ."
                  value={payload.username}
                  onChange={handleChange}
                  className={`bg-${selectedTheme}-200/90 text-sm md:text-base lg:text-lg text-${selectedTheme}-800 rounded-sm p-2 font-semibold drop-shadow-sm w-[80%]`}
                  maxLength={255}
                  minLength={8}
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-center items-center gap-2 w-full">
                <div className="flex justify-between items-center relative w-[80%]">
                  <input
                    required
                    type={!passwordVisibility ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your secure password. . ."
                    value={payload.password}
                    onChange={handleChange}
                    className={`bg-${selectedTheme}-200/90 text-sm md:text-base lg:text-lg text-${selectedTheme}-800 rounded-sm p-2 font-semibold drop-shadow-sm w-full`}
                    maxLength={255}
                    minLength={8}
                    autoComplete="off"
                  />
                  <div
                    className="absolute right-0 p-1 drop-shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      setPasswordVisibility((prev) => !prev);
                    }}
                  >
                    {passwordVisibility ? (
                      <IoMdEye className="size-6 md:size-7 lg:size-8 hover:text-gray-900 text-gray-800" />
                    ) : (
                      <IoMdEyeOff className="size-6 md:size-7 lg:size-8 hover:text-gray-900 text-gray-800" />
                    )}
                  </div>
                </div> 
              </div>
              {warning && 
              <p className={`text-red-800 text-xs md:text-sm lg:text-sm font-normal p-1 bg-${selectedTheme}-50 rounded-lg text-center w-[80%]`}>
                {warning}
              </p>}
              <button
                disabled={isLoading || warning}
                type="submit"
                className={`font-semibold p-2 rounded-sm w-[80%] transition-colors duration-200 ${
                  !isLoading
                    ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600`
                    : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner`
                }`}
              >
                <p className="drop-shadow-lg">
                  {!isLoading ? "Login" : <Spinner />}
                </p>
              </button>
              {notifMessage && (
                <div
                  className="w-full flex items-center justify-center"
                >
                  <div className="w-[80%] bg-blue-200 p-1 text-blue-600 font-medium text-center rounded-md drop-shadow-md">
                    {notifMessage}
                  </div>
                </div>
              )}
            </form>

            <div
              className={`flex flex-col justify-center items-center gap-2 bg-${selectedTheme}-50 rounded-lg basis-1/2 h-full p-4`}
            >
              <img
                src="/MHO_logo.png"
                className="size-32 md:size-32 lg:size-36"
                alt="..."
              />
              <p className="text-2xl font-semibold text-center italic leading-relaxed text-gray-800">
                “{quote.quote}”
              </p>
              <p className="text-lg text-center font-medium text-gray-700 mt-4">
                — {quote.author}
              </p>
              <p className="text-sm text-center text-gray-500">
                {quote.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
