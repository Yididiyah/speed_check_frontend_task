import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import { Box, Container, Grid, Typography } from "@mui/material";
import SelectComponent from "@/components/SelectComponent";

import MapComponent from "@/components/Map/MapComponent";
import { fetchGeoJSONData, fetchJSONData } from "@/utils/api";
import { useState, useEffect } from "react";

const DEFAULT_CENTER = [55.5, -1.9];

export default function Home() {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");

  // function to determine color based on density value
  const getColor = (density) => {
    return density > 120
      ? "#800026"
      : density > 90
      ? "#BD0026"
      : density > 70
      ? "#E31A1C"
      : density > 50
      ? "#FC4E2A"
      : density > 30
      ? "#FD8D3C"
      : density > 20
      ? "#FEB24C"
      : density > 0
      ? "#FED976"
      : "#FFEDA0";
  };

  // function to style the choropleth feature
  const style = (feature) => {
    const density = feature.properties.density;
    console.log("density", density);
    return {
      // fillColor: getColor(dataBasedOnFeature?.properties.Density),
      fillColor: getColor(density),
      fillOpacity: 0.8,
      weight: 2,
      opacity: 1,
      color: "white",
    };
  };

  // function to highlight the choropleth feature on mouse hover
  const highlightFeature = (event) => {
    const layer = event.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
  };

  // function to reset the choropleth feature style on mouseout
  const resetHighlight = (event) => {
    const layer = event.target;
    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    });
  };

  // to bind mouse events to the choropleth feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  useEffect(() => {
    (async function fetchData() {
      try {
        const geoJson = await fetchGeoJSONData({
          division: selectedLevel || 1,
        });
        const data = await fetchJSONData({
          division: selectedLevel || 1,
        });
        const features = geoJson.features;

        features.forEach((feature) => {
          const matchingData = data.features.find((district) => {
            if (district.properties.lvl1_name) {
              return (
                district.properties.lvl1_name === feature.properties.lvl1_name
              );
            } else {
              return (
                district.properties.lvl2_name === feature.properties.lvl2_name
              );
            }
          });
          if (matchingData) {
            feature.properties.density = matchingData.properties.Density;
          }
        });
        setGeoJSONData({ ...geoJson });
        setDistrictData(data.features);
        console.log("GeoJsonData", geoJson);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    })();
  }, [selectedLevel]);

  return (
    <>
      <Head>
        <title>UK Population Density</title>
        <meta
          name="description"
          content="A Choropleth map of UK population density"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }} minHeight="100vh">
        <Container sx={{ height: "100%" }}>
          <Grid container spacing={1} height="100%">
            <Grid item xs={12}>
              <Typography
                variant="h3"
                mt={1}
                sx={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                UK population density
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <SelectComponent
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                districtData={districtData}
              />
            </Grid>
            <Grid item xs={9}>
              {!geoJSONData && <Box>Loading GeoJSON data...</Box>}

              <MapComponent
                width="800"
                height="400"
                center={DEFAULT_CENTER}
                zoom={5}
                maxZoom={10}
                minZoom={3}
                zoomControl={true}
              >
                {({ TileLayer, GeoJSON, Marker, Popup }) => {
                  return (
                    <>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />

                      {geoJSONData && (
                        <GeoJSON
                          key={JSON.stringify(geoJSONData)}
                          data={geoJSONData}
                          style={style}
                          onEachFeature={onEachFeature}
                        />
                      )}
                      {/* <Marker position={DEFAULT_CENTER}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker> */}
                    </>
                  );
                }}
              </MapComponent>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
