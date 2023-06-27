import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "@/styles/Map.module.css";
import { useEffect } from "react";

const { MapContainer, useMap } = ReactLeaflet;

const Map = ({
  children,
  className,
  width,
  height,
  selectedDistrictFeature,
  ...rest
}) => {
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }
  const ZoomToDistrict = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedDistrictFeature && map) {
        const geometry = Leaflet.geoJSON(selectedDistrictFeature.geometry);
        //TODO: continue here to make district info visible on button click
        const popup = Leaflet.popup()
          .setLatLng([55.5, -1.9])
          .setContent("<p>Test</p>")
          .openOn(map);
        const geoJsonBounds = geometry.getBounds();

        map.fitBounds(geoJsonBounds);
        console.log("selectedDistrictFeature", selectedDistrictFeature);
        console.log("map", map);
      }
    }, [selectedDistrictFeature, map]);
    return null;
  };

  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
      {selectedDistrictFeature && <ZoomToDistrict />}
    </MapContainer>
  );
};

export default Map;
