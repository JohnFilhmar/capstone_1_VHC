import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { MdOutlineSmartToy } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from "react";
import useQuery from "../../../../hooks/useQuery";
import { socket } from "../../../../socket";
import { colorTheme } from "../../../../App";

const JsonWebToken = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const [selectedTheme] = useContext(colorTheme);

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const { verifyToken } = useQuery();

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [
        ...prev,
        { message: data, sender: 'other'}
      ]);
      const time = setTimeout(() => {
        scrollToBottom();
      },500);
      return () => clearTimeout(time);
    });
    return () => socket.off('message');
  }, []);

  let debounceTimeout;
  async function handleRefreshToken() {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      await verifyToken();
    }, 300);
  };
  
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!socket.disconnected) {
      socket.emit('newMessage', message);
      setMessages(prev => [
        ...prev,
        { message: message, sender: 'me' }
      ]);
      setMessage('');
    } else {
      setMessage('');
    }
    const time = setTimeout(() => {
      scrollToBottom();
    },500);
    return () => clearTimeout(time);
  };
  
  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } 
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<MdOutlineSmartToy />} />
        </div>

        <div className={`bg-${selectedTheme}-200 text-${selectedTheme}-800 flex flex-col  gap-3 rounded-md mt-3`}>
          <p className={`text-lg md:text-xl lg:text-2xl p-3 text-start font-bold bg-${selectedTheme}-400 text-${selectedTheme}-900 rounded-sm p-4`}>
            Socket.io & JWT
          </p>
          <div className={`flex flex-col md:flex-row lg:flex-row justify-center md:justify-between lg:justify-between items-center p-2 bg-${selectedTheme}-400 font-bold`}>
            <form onSubmit={handleSendMessage} className="flex flex-col md:flex-row lg:flex-row justify-start items-center gap-2 w-full">
              <label htmlFor="message">Message:</label>
              <input 
                type="text" 
                name="message" 
                id="message" 
                placeholder="Enter message here...."
                maxLength={50}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-md font-semibold text-xs md:text-sm lg:text-base text-gray-800 border-2 bg-gray-100" 
              />
              <button className={`${socket.connected ? `bg-${selectedTheme}-800 text-${selectedTheme}-200 drop-shadow-md` : `bg-${selectedTheme}-200 text-${selectedTheme}-500 shadow-inner`} font-semibold rounded-md drop-shadow-md hover:bg-${selectedTheme}-700 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-900 active:text-${selectedTheme}-300 p-1 md:p-2 lg:p-2 border-[1px] border-${selectedTheme}-500`}>
                Send Message
              </button>
            </form>
            <div className="flex justify-end items-center p-2">
              <button onClick={() => handleRefreshToken()} className={`bg-${selectedTheme}-200 text-${selectedTheme}-800 font-bold p-1 md:p-2 lg:p-2 hover:bg-${selectedTheme}-100 hover:text-${selectedTheme}-700 active:bg-${selectedTheme}-900 active:text-${selectedTheme}-300 rounded-md text-nowrap border-2 border-${selectedTheme}-500`}>Refresh Token</button>
            </div>
          </div>
          <div className="max-h-[30vh] md:max-h-[55vh] lg:max-h-[55vh] overflow-y-auto scroll-smooth flex flex-col gap-2 m-4">
            {(!messages || messages.length === 0) && (
              <div className={`flex justify-center w-full items-center text-${selectedTheme}-800 font-bold rounded-md bg-${selectedTheme}-400 p-2 animate-pulse`}>
                <p>Messages empty...</p>
              </div>
            )}
            {(messages || messages.length > 0) && messages.map((arr, i) => (
              <div key={i} className={`flex ${arr?.sender !== 'me' ? 'self-start' : 'self-end'} items-center p-2 font-bold bg-${arr?.sender !== 'me' ? selectedTheme : 'blue' }-800 text-${arr?.sender !== 'me' ? selectedTheme : 'blue' }-200 rounded-md max-w-72 text-wrap`}>
                <p>{arr.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>
        </div>

      </div>      
    </div>
  );
};

export default JsonWebToken;
