import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaStore } from "react-icons/fa";
import useIndexedDB from "../../../../hooks/useIndexedDb";
import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";
import { MdKeyboardArrowRight } from "react-icons/md";

const IndexedDb = () => {
  const [selectedTheme] = useContext(colorTheme);
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1); 
  const [storeName, setStoreName] = useState('');
  const [stores, setStores] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [contents, setContents] = useState('');
  const { getAllStoreNames, getItem, getStoreKeys, addItem } = useIndexedDB();

  async function getStores() {
    const res = await getAllStoreNames();
    setStores(res);
  };

  useEffect(() => {
    getStores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let keyNum = 0;
  async function getKeys(i) {
    const res = await getStoreKeys(stores[i]);
    let val;
    if (keyNum < res.length) {
      setSelectedKey(res[keyNum]);
      val = await getItem(stores[i], res[keyNum]);
      keyNum++;
    } else {
      setSelectedKey(res[0]);
      val = await getItem(stores[i], res[0]);
      keyNum = 0;
    }
    setContents(val);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (storeName.length > 3) {
      await addItem(storeName, 'value here');
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<FaStore />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col md:flex-row lg:flex-row justify-between p-4 items-center h-full gap-4">
            <div className={`flex flex-col justify-start items-center bg-${selectedTheme}-200 text-${selectedTheme}-800 font-semibold w-full h-full rounded-md`}>
              <p className={`font-bold text-base md:text-lg lg:text-xl p-3`}>Controller</p>
              <div className={`flex flex-col justify-start items-start gap-3 p-3 max-h-full overflow-y-auto bg-${selectedTheme}-400 rounded-md w-full`}>
                <form onSubmit={handleSubmit} className={`bg-${selectedTheme}-800 text-${selectedTheme}-200 flex flex-col gap-2 rounded-sm w-full`}>
                  <div className="p-2 flex flex-col md:flex-row lg:flex-row gap-1 justify-between items-center">
                    <label htmlFor="storename" className="text-nowrap">Store name:</label>
                    <input 
                      type="text" 
                      name="storename" 
                      id="storename" 
                      placeholder="Enter store name..."
                      maxLength={20}
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      minLength={3}
                      className={`rounded-md p-1 text-${selectedTheme}-800 font-normal grow`}
                    />
                  </div>
                  <button className={`bg-${selectedTheme}-100 text-${selectedTheme}-700 border-${selectedTheme}-400 font-bold p-1 md:p-2 lg:p-2 text-nowrap`}>Add Store</button>
                </form>
              </div>
            </div>
            <div className={`flex flex-col justify-start items-center bg-${selectedTheme}-200 text-${selectedTheme}-800 font-semibold w-full h-full rounded-md`}>
              <p className={`font-bold text-base md:text-lg lg:text-xl p-3`}>Stores</p>
              <div className={`relative flex flex-col justify-start items-start gap-3 p-3 max-h-full overflow-y-auto bg-${selectedTheme}-400 rounded-md w-full`}>
                {stores.map((store, i) => (
                  <button onClick={() => getKeys(i)} key={i} className={`flex gap-1 items-center justify-start w-full font-bold text-start text-nowrap bg-${selectedTheme}-800 text-${selectedTheme}-200 p-2 rounded-sm transition-all hover:bg-${selectedTheme}-600 hover:text-${selectedTheme}-50 hover:shadow-inner shadow-sm`}>
                    Store name: {store}
                    <MdKeyboardArrowRight className="size-5"/>
                    <p>{selectedKey}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className={`flex flex-col justify-start items-center bg-${selectedTheme}-200 text-${selectedTheme}-800 font-semibold w-full h-full rounded-md`}>
              <p className={`font-bold text-base md:text-lg lg:text-xl p-3`}>Content</p>
              <div className={`flex flex-col justify-start items-start gap-3 p-3 max-h-full max-w-full overflow-y-auto overflow-x-hidden bg-${selectedTheme}-400 rounded-md w-full`}>
                <p className="break-all">{contents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default IndexedDb;