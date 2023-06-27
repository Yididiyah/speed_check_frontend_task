import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "@/styles/Map.module.css";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const { MapContainer, useMap, Popup } = ReactLeaflet;

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
    const [showPopup, setShowPopup] = useState(false);
    const [popupLat, setPopupLat] = useState(0);
    const [popupLng, setPopupLng] = useState(0);
    const [name, setName] = useState("");
    const [density, setDensity] = useState("");
    useEffect(() => {
      if (selectedDistrictFeature && map) {
        const geometry = Leaflet.geoJSON(selectedDistrictFeature.geometry);
        const info = selectedDistrictFeature.properties;
        const name = info.lvl1_name || info.lvl2_name;
        setName(name);
        const { density } = info;
        setDensity(density);

        const geoJsonBounds = geometry.getBounds();

        map.fitBounds(geoJsonBounds);

        console.log("selectedDistrictFeature", selectedDistrictFeature);
        const { _northEast, _southWest } = geoJsonBounds;

        // set Latitude and Longitude for the popup
        setPopupLat((_northEast.lat + _southWest.lat) / 2);
        setPopupLng((_northEast.lng + _southWest.lng) / 2);

        setShowPopup(true);
      }
    }, [selectedDistrictFeature, map]);
    return showPopup ? (
      <Popup position={[popupLat, popupLng]}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="p">Density: {density}</Typography>
      </Popup>
    ) : null;
  };

  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
      {selectedDistrictFeature && <ZoomToDistrict />}
    </MapContainer>
  );
};

export default Map;
