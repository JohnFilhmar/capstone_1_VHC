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
        <div>
          <Header title={ title } icon={<MdHome />}/>
        </div>
        <div className="min-h-full h-full overflow-y-auto scroll-smooth p-2 mt-2">
          
        </div>
      </div>
    </div>
  );
}

export default Home;