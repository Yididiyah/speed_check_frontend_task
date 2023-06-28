// function to determine color based on density value
export const getColor = (density) => {
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
export const style = (feature) => {
  const density = feature.properties.density;
  return {
    fillColor: getColor(density),
    fillOpacity: 0.8,
    weight: 2,
    opacity: 1,
    color: "white",
  };
};

// function to highlight the choropleth feature on mouse hover
export const highlightFeature = (event) => {
  const layer = event.target;
  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });
};

// function to reset the choropleth feature style on mouseout
export const resetHighlight = (event) => {
  const layer = event.target;
  layer.setStyle({
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  });
};
