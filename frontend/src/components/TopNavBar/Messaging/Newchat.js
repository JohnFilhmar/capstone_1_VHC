import { useContext, useEffect, useState } from "react";
import { colorTheme, messaging } from "../../../App";
import { Avatar } from "flowbite-react";
import { IoClose } from "react-icons/io5";
import useWindowSize from "../../../hooks/useWindowSize";
import useQuery from "../../../hooks/useQuery";

const Newchat = ({ newchat, closeNewChat, openChatbox }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { avatarSize } = useWindowSize();
  const { response, postData } = useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const {selectedChat, setSelectedChat} = useContext(messaging);

  useEffect(() => {
    let time;
    if (searchQuery.length > 2) {
      time = setTimeout(() => {
        postData("/searchUsername", { name: searchQuery });
      }, 800);
    } else {
      setSearchResults(null);
    }
    if (time) return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (response?.status === 200) {
      setSearchResults(response.data);
    }
  }, [response]);

  async function selectNewChat(id) {
    const selected = searchResults.find(prev => prev.user_id === id);
    setSelectedChat({
      hearer: selected.user_id,
      name: selected.username,
      profile_image: selected.profile_image,
      target_uuid: selected.uuid
    });
    setSearchQuery("");
    setSearchResults(null);
    closeNewChat();
    openChatbox();
  }

  return (
    <dialog
      ref={newchat}
      className={`rounded-tl-lg mr-0 fixed right-0 bottom-0 transition-colors duration-200 bg-${selectedTheme}-50 drop-shadow-lg`}
    >
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center m-2 text-${selectedTheme}-600`}
        >
          <div className="flex justify-between items-center">
            <p className={`font-semibold p-1 text-${selectedTheme}-700`}>
              Create new message
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <button onClick={closeNewChat}>
              <IoClose
                className={`rounded-3xl transition-colors hover:bg-${selectedTheme}-200 duration-200 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 p-1`}
              />
            </button>
          </div>
        </div>
        <div className={`w-64 md:w-72 lg:w-80`}>
          <div
            className={`flex items-center justify-start gap-2 p-3 border-b-[1px] border-${selectedTheme}-700`}
          >
            <label htmlFor="recipient" className={`text-${selectedTheme}-600`}>
              To:
            </label>
            <input
              type="text"
              name="recipient"
              id="recipient"
              className="p-1 rounded-lg grow bg-transparent border-0"
              maxLength={50}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div
            className={`h-64 max-h-64 md:h-72 md:max-h-72 lg:h-80 lg:max-h-80 overflow-y-auto overflow-x-hidden`}
          >
            {searchResults ? (
              searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => selectNewChat(result.user_id)}
                  className={`w-full p-1 m-1 mx-2 rounded-lg transition-colors duration-200 hover:drop-shadow-sm hover:bg-${selectedTheme}-200`}
                >
                  <div className="flex justify-start items-center">
                    <Avatar
                      img={
                        result.profile_image?.contentType
                          ? `data:${result.profile_image.contentType};base64,${result.profile_image.base64Image}`
                          : "default_profile.svg"
                      }
                      rounded
                      // status="online"
                      size={avatarSize}
                      statusPosition="bottom-right"
                    />
                    <div className="block ml-2 grow">
                      <p
                        className={`text-start text-${selectedTheme}-600 font-semibold`}
                      >
                        {result.username}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div
                className={`p-4 text-center text-${selectedTheme}-600 font-bold`}
              >
                <p>Search and create a conversation. . .</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Newchat;
