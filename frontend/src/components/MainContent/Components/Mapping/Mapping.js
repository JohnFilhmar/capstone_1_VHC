import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaMapMarkedAlt } from "react-icons/fa";
import Map, { Source, Layer } from "react-map-gl";
import geoJSON from './barangayGeoJSONs.json';
import React from "react";

const Mapping = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <div className="w-full overflow-y-hidden flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<FaMapMarkedAlt />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] scroll-smooth p-2 mt-2 overflow-y-hidden">
          <div className="mb-60 md:mb-72 lg:mb-80 w-full">
            <Map
              mapboxAccessToken="pk.eyJ1IjoiYW1wZWwtMjMiLCJhIjoiY2x2Z2NidzVjMHVjMDJpbnZtMThmNm51MCJ9.xce_TB3zt17jZYgYVG3new"
              initialViewState={{
                longitude: 121.24400604529141,
                latitude: 13.140214281802134,
                zoom: 11,
              }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              style={{ width: "100%", height: "40rem", borderRadius: "0.5rem", overflowY: "hidden" }}
            >
              {Object.entries(geoJSON).map(([key, val], i) => {
                return (
                  <React.Fragment key={i}>
                  <Source id={`${key}-data`} type="geojson" data={val.geojson}>
                    <Layer {...val.layer} />
                    <Layer {...val.label} />
                  </Source>
                </React.Fragment>
                )
              })}
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapping;
