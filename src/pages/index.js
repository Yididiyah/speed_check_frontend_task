import Head from "next/head";

import { Box, Container, Grid, Typography } from "@mui/material";
import SelectComponent from "@/components/SelectComponent";

import MapComponent from "@/components/Map/MapComponent";
import { fetchGeoJSONData, fetchJSONData } from "@/utils/api";
import { useState, useEffect } from "react";
import {
  style,
  highlightFeature,
  resetHighlight,
} from "@/components/Map/mapUtils";

const DEFAULT_CENTER = [55.5, -1.9];

export default function Home() {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictFeature, setSelectedDistrictFeature] = useState(null);
  const [withZoom, setWithZoom] = useState(false);

  // to bind mouse events to the choropleth feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (event) => {
        highlightFeature(event);
        setWithZoom(false);
        setSelectedDistrictFeature(feature);
      },
      mouseout: resetHighlight,
      click: () => {
        setWithZoom(false);
        setSelectedDistrictFeature(feature);
      },
    });
  };

  useEffect(() => {
    async function fetchData() {
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
        // console.log("GeoJsonData", geoJson);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    }
    fetchData();
  }, [selectedLevel]);

  useEffect(() => {
    if (geoJSONData) {
      const featureGeoJson = geoJSONData.features.find((feature) => {
        const featureName =
          feature.properties.lvl1_name || feature.properties.lvl2_name;
        return featureName === selectedDistrict;
      });
      setWithZoom(true);
      setSelectedDistrictFeature(featureGeoJson);
    }
  }, [selectedDistrict, geoJSONData]);

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
                setSelectedDistrict={setSelectedDistrict}
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
                selectedDistrictFeature={selectedDistrictFeature}
                withZoom={withZoom}
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
                          key={JSON.stringify(districtData)}
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
