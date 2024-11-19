import { useContext, useRef, useState } from "react";
import { colorTheme, notificationMessage } from "../../../App";
import { MdFeedback } from "react-icons/md";
import { Spinner } from "flowbite-react";
import useCurrentTime from "../../../hooks/useCurrentTime";
import api from "../../../axios";
import { FiPaperclip } from "react-icons/fi";

const FeedbackForm = ({ feedbackRef, toggle }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { mysqlTime } = useCurrentTime();
  // eslint-disable-next-line no-unused-vars
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const options = [
    {
      label: "User Interface (UI) / User Experience (UX)",
      areas: ["Design/Layout", "Navigation", "Responsiveness", "Accessibility"],
    },
    {
      label: "Functionality",
      areas: ["Features", "Performance", "Reliability", "Compatibility"],
    },
    {
      label: "Content",
      areas: ["Clarity", "Relevance", "Accuracy", "Completeness"],
    },
    {
      label: "Interactivity",
      areas: [
        "Forms",
        "Buttons/Links",
        "Error Handling",
        "Feedback Mechanisms",
      ],
    },
    {
      label: "Security",
      areas: [
        "Login/Authentication",
        "Data Protection",
        "Permissions",
        "Vulnerability Awareness",
      ],
    },
    {
      label: "Support/Documentation",
      areas: [
        "Help/Support Center",
        "Documentation/FAQs",
        "Tutorials/Guides",
        "Community/Forums",
      ],
    },
    {
      label: "Performance",
      areas: [
        "Page Load Times",
        "Responsiveness",
        "Resource Consumption",
        "Error Handling",
      ],
    },
    {
      label: "Integration",
      areas: [
        "Third-party Services/APIs",
        "Compatibility with Other Systems",
        "Data Exchange",
      ],
    },
    {
      label: "Customization/Personalization",
      areas: [
        "User Preferences",
        "Settings",
        "Profile Management",
        "Tailored Experiences",
      ],
    },
    {
      label: "Communication/Notifications",
      areas: ["Alerts", "Notifications", "Messaging", "Updates"],
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const imageFile = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const newPayload = {
      ...payload,
      formType: "Problem Report",
      dateTime: mysqlTime,
    };
    const file = imageFile.current?.files[0];
    if (file) {
      newPayload.file = file;
    }
    try {
      const res = await api.post("/sendEmail", newPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.status === 204) {
        setPayload((prev) => ({ ...prev, email: "" }));
        setNotifMessage("Invalid Email, Try again!");
      }
      if (res?.status === 200) {
        setNotifMessage(`${res?.data.message}`);
        toggleClose(e);
      }
    } catch (error) {
      setNotifMessage(error?.data?.message);
      toggleClose(e);
    }
    setIsLoading(false);
  }

  const toggleClose = (e) => {
    e.preventDefault();
    toggle();
    setPayload(null);
  };

  //  HANDLE SPAM BY ONLY MAKING THE USER SUBMIT ONLY ONE REPORT FOR THE ADMIN TO ACCEPT FOR THE USER REQUEST TO REFRESH BACK TO 1
  return (
    <dialog
      ref={feedbackRef}
      className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg`}
    >
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}
        >
          <div className="flex items-center p-1 gap-1">
            <MdFeedback className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <strong className="font-semibold">Submit a Feedback</strong>
          </div>
        </div>
        <p className={`font-bold text-${selectedTheme}-700 m-2 pl-2`}>
          Share your thoughts
        </p>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-0 mx-5 my-2 w-72 md:w-80 lg:w-[500px]`}
        >
          <div className="p-2">
            <label
              htmlFor="email"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Email Address: (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={payload?.email || ""}
              onChange={handleChange}
              placeholder="Enter your valid and working email address. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              maxLength={100}
            />
            {payload?.email && (
              <p
                className={`text-xs text-blue-700 font-normal p-1 text-left`}
              >
                You will be notified via email if your problem has been resolved. This will take a day or more.
              </p>
            )}
          </div>
          <div className={`p-2`}>
            <label
              htmlFor="area"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Area:
            </label>
            <select
              id="area"
              name="area"
              value={payload?.area || ""}
              onChange={handleChange}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
            >
              <option value="" disabled>
                Select an Area
              </option>
              {options.map((category, index) => (
                <optgroup key={index} label={category.label}>
                  {category.areas.map((area, idx) => (
                    <option key={idx} value={area}>
                      {area}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className={`p-2`}>
            <label
              htmlFor="details"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Feedback Details
            </label>
            <textarea
              required
              id="details"
              name="details"
              value={payload?.details || ""}
              onChange={handleChange}
              placeholder="Share what you want, it can be a problem or issue or maybe an idea that can further improve the system. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              rows={4}
              maxLength={255}
            />
          </div>
          <div className="mt-4 m-2">
            <label
              htmlFor="file"
              className={`block mb-2 text-${selectedTheme}-600 font-normal flex gap-1 items-center`}
            >
              <FiPaperclip className="w-6 h-6 md:h-7 md:w-7 lg:w-8 lg:h-8" />
              Upload a screenshot (optional)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              ref={imageFile}
              className="block w-full rounded-lg text-xs md:text-sm lg:text-base bg-gray-50 border-[1px] border-gray-900 shadow-sm"
              accept="image/*"
            />
          </div>
          <p
            className={`text-xs text-${selectedTheme}-700 font-normal mb-4 p-2 bg-${selectedTheme}-50 rounded-lg text-center`}
          >
            Let us know if you have ideas that can help make our system better.
            If you need help with solving a specific problem or if you think
            that there are things that can further have some improvement. Share
            your ideas with us.
          </p>
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              disabled={isLoading}
              onClick={toggleClose}
              className={`py-2 px-4 hover:shadow-md font-semibold ${
                isLoading
                  ? `text-${selectedTheme}-100 bg-${selectedTheme}-600`
                  : `text-${selectedTheme}-600 hover:bg-${selectedTheme}-100`
              } rounded-lg transition-colors duration-200`}
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className={`py-2 px-4 hover:shadow-md font-semibold rounded-lg transition-colors duration-200 ${
                payload?.details?.length > 0 && payload?.area !== undefined
                  ? `text-${selectedTheme}-100 bg-${selectedTheme}-600 hover:cursor-pointer shadow-sm`
                  : `shadow-inner text-${selectedTheme}-100 bg-${selectedTheme}-400 hover:cursor-not-allowed`
              }`}
            >
              {isLoading ? (
                <Spinner />
              ) : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default FeedbackForm;
