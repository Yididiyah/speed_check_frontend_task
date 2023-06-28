import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "@/styles/Map.module.css";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Legend from "./Legend/Legend";

const { MapContainer, useMap, useMapEvent, Popup } = ReactLeaflet;

const Map = ({
  children,
  className,
  width,
  height,
  selectedDistrictFeature,
  withZoom,
  setSelectedLevel,
  zoomByButton,
  setZoomByButton,
  ...rest
}) => {
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  const MapUtils = () => {
    const map = useMap();
    const [showPopup, setShowPopup] = useState(false);
    const [popupLat, setPopupLat] = useState(0);
    const [popupLng, setPopupLng] = useState(0);
    const [name, setName] = useState("");
    const [density, setDensity] = useState("");
    const [previousZoom, setPreviousZoom] = useState("");

    useMapEvent("zoomstart", () => {
      setPreviousZoom(map.getZoom());
    });

    useMapEvent("zoomend", () => {
      const zoomLevel = map.getZoom();

      if (previousZoom !== zoomLevel) {
        setZoomByButton(false);
      }

      if (!zoomByButton) {
        if (zoomLevel <= 7) {
          setSelectedLevel(1);
        } else {
          setSelectedLevel(2);
        }
      }
    });

    useEffect(() => {
      if (selectedDistrictFeature && map) {
        const geometry = Leaflet.geoJSON(selectedDistrictFeature.geometry);
        const info = selectedDistrictFeature.properties;
        const name = info.lvl1_name || info.lvl2_name;
        setName(name);
        const { density } = info;
        setDensity(density);

        const geoJsonBounds = geometry.getBounds();

        if (withZoom) {
          map.fitBounds(geoJsonBounds);
        }

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
  // console.log("MapContainer Rendered");
  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
      <MapUtils />
      <Box sx={{ position: "relative" }}>
        <Legend />
      </Box>
    </MapContainer>
  );
};

export default Map;
