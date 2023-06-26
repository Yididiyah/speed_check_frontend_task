import { Button, Stack, Typography } from "@mui/material";

const DistrictListComponent = ({ districtList }) => {
  return (
    <Stack spacing={0.8}>
      {districtList.length > 0 &&
        districtList.map((district, index) => {
          return (
            <Button
              key={index}
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
            >
              <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                {district}
              </Typography>
            </Button>
          );
        })}
    </Stack>
  );
};

export default DistrictListComponent;
