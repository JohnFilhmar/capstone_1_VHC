import { useContext, useEffect, useRef, useState } from "react";
import { colorTheme, messaging } from "../../../App";
import { Avatar, Tooltip } from "flowbite-react";
import { FiPaperclip } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  MdClose,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdSend,
} from "react-icons/md";
import useWindowSize from "../../../hooks/useWindowSize";
import useQuery from "../../../hooks/useQuery";
import TextareaAutosize from "react-textarea-autosize";
import useCurrentTime from "../../../hooks/useCurrentTime";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { socket } from "../../../socket";

const Chatbox = ({ chatbox, toggle }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { avatarSize } = useWindowSize();
  const [size, setSize] = useState(true);
  const [chatText, setChatText] = useState("");
  const [files, setFiles] = useState({});
  const [fileIdCounter, setFileIdCounter] = useState(0);
  const chatsRef = useRef(null);
  const { searchResults, error, isLoading, searchData, response, postData } =
    useQuery();
  const textInputRef = useRef(null);
  const { mysqlTime } = useCurrentTime();
  const [selectedChat, setSelectedChat] = useContext(messaging);
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);

  const toggleSize = () => {
    setSize((prev) => !prev);
  };

  const sendMessage = async () => {
    if (chatText.length > 0) {
      const payload = {
        message: chatText.trim(),
        hearer: selectedChat.hearer,
        dateTime: mysqlTime,
        target_uuid: selectedChat.target_uuid,
      };
      socket.emit("sendMessage", {
        roomId: selectedChat.target_uuid,
        data: {
          sender_id: NaN,
          receiver_id: NaN,
          message: chatText.trim(),
          datetime_sent: mysqlTime,
          user_id: NaN
        }
      });
      await postData("/sendMessage", payload);
    }
  };

  useEffect(() => {
    socket.on('messagingSocket', (data) => {
      if (data?.status === 'ok') {
        console.log('connected to chatbox');
      }
    });
    socket.on('messageSocket', (data) => {
      console.log(data);
    });
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }
    return () => {
      socket.off('messagingSocket');
      socket.off('messageSocket');
    }
  }, []);

  useEffect(() => {
    if (response?.sent === "ok") {
      setChatText("");
      setFiles({});
      conversation.push(response.data);
      const time = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileId = fileIdCounter + 1;
      setFileIdCounter(fileId);
      setFiles({
        ...files,
        [fileId]: uploadedFile,
      });
    }
  };
  const handleRemoveFile = (fileId) => {
    const updatedFiles = { ...files };
    delete updatedFiles[fileId];
    setFiles(updatedFiles);
  };

  function closeChatBox() {
    toggle();
    setSelectedChat(null);
    setConversation(null);
  }

  useEffect(() => {
    async function getConversation() {
      await searchData("/getConversation", selectedChat?.hearer);
    }
    if (selectedChat) {
      getConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    if (searchResults) {
      setConversation(
        searchResults?.data.length > 0 ? searchResults.data : null
      );
      const time = setTimeout(() => {
        scrollToBottom();
      }, 500);
      return () => clearTimeout(time);
    }
  }, [searchResults]);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <dialog
      ref={chatbox}
      className={`rounded-tl-lg mr-0 fixed right-0 bottom-0 transition-colors duration-200 ${
        size ? `bg-${selectedTheme}-50` : `bg-${selectedTheme}-500`
      } shadow-2xl`}
    >
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-${selectedTheme}-600`}
        >
          <div className="flex justify-between items-center">
            <Avatar
              img={
                selectedChat?.profile_image?.contentType
                  ? `data:${selectedChat.profile_image.contentType};base64,${selectedChat.profile_image.base64Image}`
                  : "default_profile.svg"
              }
              rounded
              // status="online"
              size={avatarSize}
              statusPosition="bottom-right"
            />
            <p
              className={`font-semibold p-1 ${
                size ? `text-${selectedTheme}-700` : `text-${selectedTheme}-50`
              }`}
            >
              {selectedChat?.name || "..."}
            </p>
          </div>
          <div
            className={`flex flex-row justify-center items-center gap-2 ${
              size ? `text-${selectedTheme}-700` : `text-${selectedTheme}-50`
            }`}
          >
            <button onClick={() => toggleSize()}>
              {size ? (
                <MdOutlineKeyboardArrowDown
                  className={`rounded-3xl transition-colors duration-200 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1`}
                />
              ) : (
                <MdOutlineKeyboardArrowUp
                  className={`rounded-3xl transition-colors duration-200 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1`}
                />
              )}
            </button>
            <button onClick={() => closeChatBox()}>
              <IoClose
                className={`rounded-3xl transition-colors duration-200 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1`}
              />
            </button>
          </div>
        </div>
        <div className={`w-full`}>
          {size && (
            <>
              <div
                ref={chatsRef}
                className={`flex flex-col h-52 max-h-52 md:h-60 md:max-h-60 lg:h-64 lg:max-h-64 overflow-y-auto`}
              >
                {!error &&
                  !conversation &&
                  isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex justify-${
                        i % 2 ? "end" : "start"
                      } items-center m-[0.15rem] text-wrap drop-shadow animate-pulse`}
                    >
                      <p
                        className={`basis-1/2 p-2 rounded-2xl bg-${selectedTheme}-300`}
                      >
                         
                      </p>
                    </div>
                  ))}
                {conversation?.length > 0 ? (
                  conversation.map((message, i) => (
                    <div
                      key={i}
                      className={`flex justify-${
                        message.sender_id === message.user_id ? "end" : "start"
                      } items-center m-[0.18rem] text-wrap drop-shadow`}
                    >
                      <p
                        className={`basis-[70%] p-2 rounded-2xl ${
                          message.sender_id === message.user_id
                            ? `bg-${selectedTheme}-800 text-${selectedTheme}-300`
                            : "bg-gray-300 text-gray-800"
                        } leading-tight tracking-tight`}
                      >
                        {message.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center p-1`}
                  >
                    <p className={`text-${selectedTheme}-800 font-semibold`}>
                      Conversation is empty.
                    </p>
                    <p
                      className={`text-${selectedTheme}-800 font-bold animate-pulse`}
                    >
                      Start a conversation!
                    </p>
                  </div>
                )}
                {error && !isLoading && !conversation && (
                  <div className={`flex justify-center items-center w-full`}>
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {files && Object.keys(files).length > 0 && (
                <div
                  className={`flex items-center justify-start gap-2 overflow-x-auto p-4 m-2 bg-${selectedTheme}-200 rounded-lg`}
                >
                  {Object.keys(files).map((id) => (
                    <div
                      key={id}
                      className={`relative flex items-center justify-start gap-1 px-2 py-7 bg-${selectedTheme}-100 rounded-md`}
                    >
                      <FiPaperclip
                        className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-${selectedTheme}-600`}
                      />
                      <p className={`text-sm text-${selectedTheme}-600`}>
                        {files[id].name.substring(0, 5)}...
                      </p>
                      <button
                        onClick={() => handleRemoveFile(id)}
                        className={`absolute -top-2 -right-2 hover:bg-${selectedTheme}-400 rounded-3xl bg-${selectedTheme}-300`}
                      >
                        <MdClose
                          className={`w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 p-1 text-${selectedTheme}-600`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`flex justify-start items-center gap-[0.15rem] p-1 mt-2 border-t-[1px] border-${selectedTheme}-600`}
              >
                <div className="self-end">
                  <Tooltip content="Not yet working" animation="duration-500">
                    <label
                      htmlFor="fileInput"
                      className={`p-2 transition-colors duration-200 bg-${selectedTheme}-100 hover:bg-${selectedTheme}-200 rounded-3xl flex items-center justify-center animate-pulse`}
                    >
                      <FiPaperclip
                        className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-${selectedTheme}-600 mr-1`}
                      />
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled
                      />
                    </label>
                  </Tooltip>
                </div>
                <form
                  className="grow"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <TextareaAutosize
                    className="block w-full overflow-x-auto p-1 rounded-sm"
                    placeholder="Aa"
                    minRows={1}
                    maxRows={3}
                    disabled={isLoading}
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    ref={textInputRef}
                    style={{ resize: "none" }}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        e.preventDefault();
                        if (!(isLoading || error || !conversation)) {
                          sendMessage();
                        }
                      }
                    }}
                  />
                </form>
                <div className="self-end">
                  <Tooltip content="Send" animation="duration-500">
                    <button
                      disabled={isLoading || error || !conversation}
                      onClick={() => sendMessage()}
                      className={`p-2 flex items-center transition-colors duration-200 bg-${selectedTheme}-100 hover:bg-${selectedTheme}-200 rounded-3xl`}
                    >
                      {!isLoading ? (
                        <MdSend
                          className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-${selectedTheme}-600`}
                        />
                      ) : (
                        <AiOutlineLoading3Quarters
                          className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-${selectedTheme}-600 animate-spin`}
                        />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Chatbox;
