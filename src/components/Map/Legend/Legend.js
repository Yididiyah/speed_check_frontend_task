import L from "leaflet";
import { useEffect, useState } from "react";
import styles from "./Legend.module.css";
import { useMap } from "react-leaflet";
import { getColor } from "../mapUtils";
import { Box, Typography } from "@mui/material";

function Legend() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", `${styles.info} ${styles.legend}`);
        const grades = [0, 20, 30, 50, 70, 90, 120];

        let labels = [];
        let from;
        let to;
        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];
          labels.push(
            `<i class="${styles.icon}" style="background:${getColor(
              from + 1
            )}"></i> ${from}${to ? "&ndash;" + to : "+"}`
          );
        }
        div.innerHTML = labels.join("<br>");
        return div;
      };
      legend.addTo(map);
      return () => {
        legend.onRemove = (map) => {
          L.DomUtil.remove(legend);
        };
      };
    }
  }, []);
  return null;
}

export default Legend;
