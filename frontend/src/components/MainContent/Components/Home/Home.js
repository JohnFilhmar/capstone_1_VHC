import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { MdHome } from "react-icons/md";

const Home = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={ title } icon={<MdHome />}/>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2">
            <div className="flex flex-col h-auto w-full">
              
            </div>
            <div className="flex flex-col h-auto w-full">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;