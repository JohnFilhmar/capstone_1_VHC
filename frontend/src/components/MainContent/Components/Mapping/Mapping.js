import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaMapMarkedAlt } from "react-icons/fa";
import Map from 'react-map-gl';

const Mapping = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <div className="w-full overflow-y-hidden flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={ title } icon={<FaMapMarkedAlt />}/>
        </div>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-60 md:mb-72 lg:mb-80">
            <div className="w-34 h-[40rem] bg-sky-50 rounded-xl col-span-2 p-4">
              <Map
                mapboxAccessToken={"pk.eyJ1IjoiYW1wZWwtMjMiLCJhIjoiY2x2Z2NidzVjMHVjMDJpbnZtMThmNm51MCJ9.xce_TB3zt17jZYgYVG3new"}
                initialViewState={{
                  longitude: 121.27920815012033,
                  latitude: 13.173153995662611,
                  zoom: 11
                }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Mapping;