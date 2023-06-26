import { Box } from "@mui/material";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
});

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const MapComponent = (props) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
  return (
    <Box sx={{ aspectRatio: width / height }}>
      <DynamicMap {...props} />
    </Box>
  );
};

export default MapComponent;
