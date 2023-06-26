import axios from "axios";

export async function fetchGeoJSONData({ division }) {
  try {
    const response = await axios.get(
      `https://sc-test-data-uk.netlify.app/great_britain_${division}.geojson`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    throw new Error("Error fetching GeoJSON data");
  }
}
