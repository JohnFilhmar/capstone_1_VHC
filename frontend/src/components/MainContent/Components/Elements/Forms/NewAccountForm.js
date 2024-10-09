import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../../App";
import useQuery from "../../../../../hooks/useQuery";
import { Label, Radio, Spinner } from "flowbite-react";
import useCurrentTime from "../../../../../hooks/useCurrentTime";
import { socket } from "../../../../../socket";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const NewAccountForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { mysqlTime } = useCurrentTime();
  const { isLoading, addData } = useQuery();
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [warning, setWarning] = useState("");
  const [repassword, setRepassword] = useState("");
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [payload, setPayload] = useState({
    username: "",
    password: "",
    email: "",
    role: "staff",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'repassword') {
      setRepassword(value);
    }
    setPayload((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setPayload((prev) => ({
      ...prev,
      current_datetime: String(mysqlTime)
    }));
  }
  
  useEffect(() => {
    if (payload.password !== repassword) {
      setIsWarningShown(true);
      setWarning("Password does not match!");
    } else {
      validatePasswordStrength(payload.password);
      validatePasswordStrength(repassword);
    }
  }, [payload.password, repassword]);

  function cleanUp() {
    setPayload({
      username: "",
      password: "",
      email: "",
      role: "staff",
    });
    setRepassword("");
    setIsWarningShown(false);
    close();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addData('addStaff',payload);
    setIsWarningShown(false);
    cleanUp();
    const time = setTimeout(() => {
      socket.emit("newStaffSocket", payload.username);
    }, 500)
    return () => {
      clearTimeout(time);
    };
  };

  useEffect(() => {
    if (payload.password.length === 0) {
      setRepassword('');
    }
  }, [payload.password]);

  function generateStrongPassword() {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;
    const remainingLength = Math.floor(Math.random() * 3) + 4;
    
    for (let i = 0; i < remainingLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    setPayload(prev => ({ ...prev, password: password }));
    setRepassword(password);
    // return password;
  }
  
  function validatePasswordStrength(password) {
    const missingConditions = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength) {
      setIsWarningShown(false);
      return true;
    } else {
      if (!hasUpperCase) missingConditions.push("an uppercase letter");
      if (!hasLowerCase) missingConditions.push("a lowercase letter");
      if (!hasNumber) missingConditions.push("a number");
      if (!hasSpecialChar) missingConditions.push("a special character");
      if (!isValidLength) missingConditions.push("at least 8 characters in length");
      setWarning(`Password must contain: ${missingConditions.join(", ")}.`);
      setIsWarningShown(true);
    }
    return false;
  }
  
  return (
    <>
      {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24 w-[20rem] md:w-[50rem] lg:w-[50rem]" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <label htmlFor="username" className='text-xs md:text-sm lg:text-base font-semibold'>User Name</label>
          </div>
          <input 
            type="text" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            id="username" 
            name="username"
            placeholder="Enter user name. . . . ." 
            value={payload.username} 
            onChange={handleChange} 
            autoComplete="off"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <label htmlFor="password" className='text-xs md:text-sm lg:text-base font-semibold'>Password</label>
          </div>
          <div className="flex gap-1">
            <input 
              required 
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              maxLength={50} 
              minLength={8}
              id="password"
              name="password"
              type={isPassVisible ? 'text' : 'password'} 
              placeholder="Create a unique password. . . . ."
              value={payload.password}
              onChange={handleChange} 
              autoComplete="off"
            />
            <button onClick={(e) => {e.preventDefault(); setIsPassVisible(prev => !prev);}} className={`drop-shadow-sm p-2 rounded-md bg-${selectedTheme}-200 text-${selectedTheme}-800`}>
              {isPassVisible ? (
                <IoMdEye className="size-4 md:size-5 lg:size-6"/>
              ) : (
                <IoMdEyeOff className="size-4 md:size-5 lg:size-6"/>
              )}
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 block">
            <label htmlFor="repassword" className='text-xs md:text-sm lg:text-base font-semibold'>Re-enter Password</label>
          </div>
          <input 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            minLength={8}
            id="repassword"
            name="repassword"
            type={isPassVisible ? 'text' : 'password'} 
            placeholder="Re-enter your unique password. . . . ."
            value={repassword}
            onChange={handleChange} 
            autoComplete="off"
          />
          </div>

          {isWarningShown && 
          <p className={`text-red-800 text-xs md:text-sm lg:text-sm font-thin p-1 bg-${selectedTheme}-50 rounded-lg text-center`}>
            {warning} <button className="font-bold text-blue-800" onClick={() => generateStrongPassword()}>Click this to create a strong random password.</button>
          </p>}

        <fieldset className="flex flex-row gap-3 p-2">
          <legend className="mr-4 text-xs md:text-sm lg:text-base">Choose a role</legend>
          <div className="flex items-center gap-2">
            <Radio
              id="user"
              name="role"
              value="user"
              className='text-xs md:text-sm lg:text-base'
              checked={payload.role === 'staff'}
              onChange={handleChange}
            />
            <Label htmlFor="user">Staff</Label>
          </div>
        </fieldset>
        <div>
          <div className="mb-2 block">
            <label htmlFor="email" className='text-xs md:text-sm lg:text-base font-semibold'>Email</label>
          </div>
          <input 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            minLength={8}
            id="email"
            name="email"
            type="email" 
            placeholder="Add a valid email. . . . ."
            value={payload.email}
            onChange={handleChange} 
            autoComplete="off"
          />
        </div>
        <button disabled={isLoading || isWarningShown} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${!isLoading && !isWarningShown ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner hover:cursor-not-allowed` }`}><p className="drop-shadow-lg">{isWarningShown ? 'Invalid Password' : !isLoading ? 'Add New Record' : <Spinner/>}</p></button>
      </form>
    </>
  );
}
 
export default NewAccountForm;