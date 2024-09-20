import { useState } from "react";
import { FaMinus } from "react-icons/fa";
import { RiFileHistoryFill } from "react-icons/ri";

const ChiefCompaint = ({ selectedTheme }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <RiFileHistoryFill className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Chief of Complaint and History</span>
        </div>
        <button onClick={() => setIsVisible(prev => !prev)} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          <FaMinus className="size-4 md:size-5 lg:size-6"/>
        </button>
      </p>
      <div className={isVisible ? 'block' : 'hidden'}>

      </div>
    </div>
  );
}
 
export default ChiefCompaint;