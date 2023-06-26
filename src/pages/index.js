import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import { Box, Container, Grid, Typography } from "@mui/material";
import SelectComponent from "@/components/SelectComponent";

import MapComponent from "@/components/Map/MapComponent";
import { fetchGeoJSONData } from "@/utils/api";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_CENTER = [55.5, -1.9];

export default function Home() {
  const [geoJSONData, setGeoJSONData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchGeoJSONData({ division: 1 });
        setGeoJSONData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    }

    fetchData();
  }, []);

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
              <SelectComponent />
            </Grid>
            <Grid item xs={9}>
              {!geoJSONData && <Box>Loading GeoJSON data...</Box>}
              {geoJSONData && (
                <MapComponent
                  width="800"
                  height="400"
                  center={DEFAULT_CENTER}
                  zoom={5}
                >
                  {({ TileLayer, GeoJSON, Marker, Popup }) => {
                    console.log(TileLayer);
                    return (
                      <>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* <GeoJSON data={mapData} /> */}
                        <GeoJSON data={geoJSONData} />
                        {/* <Marker position={DEFAULT_CENTER}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker> */}
                      </>
                    );
                  }}
                </MapComponent>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
