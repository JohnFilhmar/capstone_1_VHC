import { AiFillMessage } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";
import { useContext, useEffect } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { colorTheme, messaging } from "../../../App";
import { Avatar, Tooltip } from "flowbite-react";
import useQuery from "../../../hooks/useQuery";
import { socket } from "../../../socket";

const Messages = ({ message, toggle, openChatbox, createNewChat }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { avatarSize, responsiveTextSize } = useWindowSize();
  const { editData, searchResults, searchData } = useQuery();
  // eslint-disable-next-line no-unused-vars
  const {
    isConnected,
    selectedChat,
    setSelectedChat,
    messengerList,
    conversation,
    setConversation,
  } = useContext(messaging);

  const selectMessage = async (id) => {
    const selectedMessage = messengerList.find(
      (prev) => prev.message_id === id
    );
    if (!selectedMessage.is_read) {
      await editData("/updateMessageToRead", id);
      selectedMessage.is_read = true;
    }
    setSelectedChat({
      hearer: selectedMessage.hearer,
      name: selectedMessage.receiver,
      profile_image: selectedMessage.profile_image,
      target_uuid: selectedMessage.target_uuid,
    });
    await searchData("/getConversation", selectedMessage?.hearer);
    socket.emit("joinRoom", selectedMessage.target_uuid);
    toggle();
    openChatbox();
  };

  useEffect(() => {
    if (searchResults) {
      setConversation(
        searchResults?.data.length > 0 ? searchResults.data : null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  return (
    <dialog
      ref={message}
      className={`rounded-lg mr-0 fixed right-4 md:right-10 lg:right-14 top-20 bg-${selectedTheme}-100 drop-shadow-lg`}
    >
      <div className="flex flex-col m-2 text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center m-2 text-${selectedTheme}-600`}
        >
          <div className="flex justify-between items-center">
            <AiFillMessage className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1" />
            <p className="font-semibold p-1">Messages</p>
            <Tooltip
              content={isConnected ? "Connected" : "Disconnected"}
              animation="duration-500"
            >
              <div
                className={`bg-${
                  isConnected ? "green" : "red"
                }-600 rounded-full p-1 drop-shadow-sm`}
              />
            </Tooltip>
          </div>
          <button
            onClick={() => {
              createNewChat();
              toggle();
            }}
          >
            <RiEdit2Fill
              className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1 hover:text-${selectedTheme}-700 rounded-3xl transition-colors duration-200 hover:bg-${selectedTheme}-200`}
            />
          </button>
        </div>
        <div className="w-52 md:w-70 lg:w-80 flex flex-col gap-2 h-60 max-h-60 overflow-y-auto">
          {messengerList.length > 0 ? (
            messengerList?.map((message, i) => {
              const stat = !message.is_read;
              return (
                <button
                  key={i}
                  className={`rounded-lg transition-colors duration-200 hover:drop-shadow-md hover:bg-${selectedTheme}-200 focus:bg-${selectedTheme}-50`}
                  onClick={() => selectMessage(message.message_id)}
                >
                  <div className="flex items-center gap-2 mx-2">
                    <Avatar
                      img={
                        message.profile_image?.contentType
                          ? `data:${message.profile_image.contentType};base64,${message.profile_image.base64Image}`
                          : "default_profile.svg"
                      }
                      rounded
                      // status={`${message.stat}`}
                      size={avatarSize}
                      statusPosition="bottom-right"
                    />
                    <div className="flex flex-col items-start">
                      <p className={`${stat ? "font-bold" : "font-semibold"}`}>
                        {message.receiver.length > 10
                          ? `${message.receiver.substring(0, 10)}...`
                          : message.receiver}
                      </p>
                      <p
                        className={`text-slate-500 ${stat && "font-semibold"}`}
                      >
                        {message.sender_id === message.user_id && (
                          <span>You: </span>
                        )}
                        {message.message.length > 8
                          ? `${message.message.substring(
                              0,
                              Math.round(responsiveTextSize)
                            )}...`
                          : message.message}
                      </p>
                    </div>
                    {stat && (
                      <div
                        className={`p-1 bg-${selectedTheme}-700 ml-auto rounded-3xl`}
                      ></div>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center gap-1">
              <p className="font-bold text-sm md:text-base lg:text-lg flex text-center items-center w-full justify-center">
                Messages are empty!
              </p>
              <p className="font-medium text-xxs md:text-xs lg:text-sm flex text-center items-center w-full justify-center">
                Start messaging someone with 
                <button
                  onClick={() => {
                    createNewChat();
                    toggle();
                  }}
                  className="underline text-blue-800 font-bold"
                >
                  new chat
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Messages;
