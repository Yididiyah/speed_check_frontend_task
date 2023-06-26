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
export async function fetchJSONData({ division }) {
  try {
    const response = await axios.get(
      `https://sc-test-data-uk.netlify.app/data_great_britain_${division}.json`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    throw new Error("Error fetching JSON data");
  }
}
