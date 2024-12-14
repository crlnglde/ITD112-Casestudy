import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import iliganData from '../../data/iligan.json'; 
import "../../css/visualizations/Iligan.css";

const ChoroplethGraph = () => {
  // Define a function to style each feature
  const styleFeature = (feature) => {
    return {
      fillColor: getColor(feature.properties.density), // Customize based on property
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };

  // Define a function to get color based on density (or other property)
  const getColor = (density) => {
    return density > 1000
      ? '#800026'
      : density > 500
      ? '#BD0026'
      : density > 200
      ? '#E31A1C'
      : density > 100
      ? '#FC4E2A'
      : density > 50
      ? '#FD8D3C'
      : density > 20
      ? '#FEB24C'
      : density > 10
      ? '#FED976'
      : '#FFEDA0';
  };

  return (
    <div className="choropleth-map-container">
      <h2>Iligan City</h2>
      <MapContainer
        style={{ height: '400px', width: '100%' }}
        center={[8.228, 124.370]} // Approximate center of Iligan City
        zoom={11}  // Adjust the zoom level for wider view
        scrollWheelZoom={false}
        minZoom={8} // Set minimum zoom level
        maxZoom={15} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={iliganData} style={styleFeature} />
      </MapContainer>
    </div>
  );
};

export default ChoroplethGraph;
