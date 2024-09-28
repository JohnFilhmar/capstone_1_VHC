import { useEffect, useState } from "react";
import { socket } from "../socket";
import useCurrentTime from "./useCurrentTime";

const useSocket = ({ socketUrl, socketEmit, socketError }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SockError, setSockError] = useState(null);
  const { mysqlTime } = useCurrentTime();

  function convertKey(word) {
    const data = word.split('_');
    const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
    return newKey.join(' ');
  };
  
  function convertData(data) {
    const newData = data && data.map(obj => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const newKey = convertKey(key);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    return newData;
  };

  useEffect(() => {
    socket.on(socketUrl, (Sdata) => {
      if (Sdata && Sdata.length > 0) {
        setData(convertData(Sdata));
      }
      setLoading(false);
    });
    socket.on(socketError, (error) => {
      setSockError(error);
      console.error('Error retrieving data:', error);
    });
    const time = setTimeout(() => {
      socket.emit(socketEmit, {dateTime: String(mysqlTime)});
    },500);
    return () => {
      clearTimeout(time);
      socket.off(socketUrl);
      socket.off(socketError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, SockError, loading }
  
}
 
export default useSocket;