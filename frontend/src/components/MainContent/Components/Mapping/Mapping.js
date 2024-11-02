import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaMapMarkedAlt } from "react-icons/fa";
import Map, { Source, Layer } from "react-map-gl";

const Mapping = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  // Sample GeoJSON data for barangay cases
  const victoria_geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Victoria",
        },
        geometry: {
          coordinates: [
            [
              [121.31031596063588, 13.118303543571855],
              [121.32303483531949, 13.167475330372712],
              [121.3291471097293, 13.187618854455192],
              [121.3228171634395, 13.217352413225584],
              [121.29466902416326, 13.210466562936222],
              [121.29004984233333, 13.212433968560177],
              [121.26637653485707, 13.207655955817042],
              [121.22870133305656, 13.210888151043122],
              [121.2100802563046, 13.205829043933411],
              [121.1964523476225, 13.206602272875566],
              [121.17978869096595, 13.188658020326244],
              [121.18134591919335, 13.168838389337138],
              [121.16460636336649, 13.139617071651394],
              [121.16419808151703, 13.107211134678884],
              [121.14153843887334, 13.09567915770171],
              [121.2450378877054, 13.042187591185613],
              [121.31031596063588, 13.118303543571855],
            ],
          ],
          type: "Polygon",
        },
      },
    ],
  };

  const victoria_boundary_layer = {
    id: "polygon",
    type: "fill",
    paint: {
      "fill-color": "#00FF00",
      "fill-opacity": 0.3,
    },
  };

  return (
    <div className="w-full overflow-y-hidden flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<FaMapMarkedAlt />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="mb-60 md:mb-72 lg:mb-80 w-full">
            <Map
              mapboxAccessToken="pk.eyJ1IjoiYW1wZWwtMjMiLCJhIjoiY2x2Z2NidzVjMHVjMDJpbnZtMThmNm51MCJ9.xce_TB3zt17jZYgYVG3new"
              initialViewState={{
                longitude: 121.24400604529141,
                latitude: 13.140214281802134,
                zoom: 11,
              }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
              style={{ width: "100%", height: "40rem", borderRadius: "0.5rem" }}
            >
              <Source id="victoria-data" type="geojson" data={victoria_geojson}>
                <Layer {...victoria_boundary_layer} />
              </Source>
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapping;
