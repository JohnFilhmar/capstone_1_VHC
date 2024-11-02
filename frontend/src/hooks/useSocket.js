import { useEffect, useState } from "react";
import { socket } from "../socket";
import useQuery from "./useQuery";
// import useIndexedDB from "./useIndexedDb";

const useSocket = ({ fetchUrl, newDataSocket, errorDataSocket, replaceData = true }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SockError, setSockError] = useState(null);
  const { response, fetchData, error: fetchError } = useQuery();

  useEffect(() => {
    getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function getData() {
    setLoading(true);
    try {
      await fetchData(`/${fetchUrl}`);
    } catch (error) {
      setSockError(fetchError || "Error fetching initial data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.data) {
      const convertedData = convertData(response.data);
      setData(convertedData);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  
  function playSound() {
    const notif = new Audio('/queue_change.mp3');
    notif.play();
  }

  useEffect(() => {
    socket.on(newDataSocket, (Sdata) => {
      const receivedData = convertData(Sdata);
      const newData = [
        ...data,
        ...receivedData,
      ];
      setData(replaceData ? newData : receivedData);
      if (newDataSocket === 'queueSocket') {
        playSound();
      }
    });
    socket.on(errorDataSocket, (err) => {
      setSockError(err);
      console.error(err);
    });
    return () => {
      socket.off(newDataSocket);
      socket.off(errorDataSocket);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { data, SockError, loading }
  
}
 
export default useSocket;