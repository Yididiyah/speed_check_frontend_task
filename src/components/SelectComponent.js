import {
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DistrictListComponent from "./DistrictListComponent";

// const data = {
//   level1: [
//     "District A",
//     "District B",
//     "District C",
//     "District D",
//     "District E",
//   ],
//   level2: ["District A", "District B", "District C", "District D"],
// };

const SelectComponent = ({
  selectedLevel,
  setSelectedLevel,
  districtData,
  setSelectedDistrict,
}) => {
  const [labelVisible, setLabelVisible] = useState(true);
  // const [districtList, setDistrictList] = useState([]);

  const handleChange = (event) => {
    setSelectedLevel(event.target.value);
    setLabelVisible(false);
    // switch (event.target.value) {
    //   case "level1":
    //     setDistrictList(data.level1);
    //     break;
    //   case "level2":
    //     setDistrictList(data.level2);
    //     break;
    //   default:
    //     setDistrictList([]);
    // }
  };
  return (
    <Stack
      justifyContent="space-between"
      // height="30rem"
      sx={{ height: "100%" }}
    >
      <Box sx={{ minWidth: 60 }}>
        <FormControl fullWidth>
          {labelVisible && (
            <InputLabel id="label-select-level" shrink={false}>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                Select
              </Typography>
            </InputLabel>
          )}

          <Select
            labelId="label-select-level"
            id="select-level"
            value={selectedLevel}
            displayEmpty
            onChange={handleChange}
            input={
              <InputBase
                sx={{
                  padding: "10px 14px",
                  height: 50,
                  backgroundColor: "#d4d4d4",
                }}
              />
            }
          >
            <MenuItem value={1}>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                Level 1
              </Typography>
            </MenuItem>
            <MenuItem value={2}>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                Level 2
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DistrictListComponent
        districtList={districtData}
        setSelectedDistrict={setSelectedDistrict}
      />
    </Stack>
  );
};

export default SelectComponent;
