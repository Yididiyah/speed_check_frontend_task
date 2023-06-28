import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

const DistrictListComponent = ({
  districtList,
  setSelectedDistrict,
  setZoomByButton,
}) => {
  const handleClick = (event, district) => {
    const districtName =
      district.properties.lvl1_name || district.properties.lvl2_name;
    setSelectedDistrict(districtName);
    setZoomByButton(true);
  };
  return (
    <List spacing={0.8} sx={{ maxHeight: "20rem", overflow: "auto" }}>
      {districtList &&
        districtList.length > 0 &&
        districtList.map((district, index) => {
          return (
            <ListItem
              key={index}
              disableGutters
              disablePadding
              sx={{ marginBottom: "0.3rem" }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  padding: "10px 15px",
                  borderRadius: "0",
                  backgroundColor: "#d4d4d4",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#a8a8a8",
                  },
                }}
                onClick={(e) => handleClick(e, district)}
              >
                <ListItemText
                  primary={
                    district.properties.lvl1_name ||
                    district.properties.lvl2_name
                  }
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
};

export default DistrictListComponent;
