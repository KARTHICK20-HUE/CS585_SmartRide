/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 29.424305587455322,
  lng: -98.49368583068679,
};

const LiveTracking = ({
  pickup,
  destination,
  captainLocation,
  vehicleType,
}) => {
  const [pickupCoord, setPickupCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);

  const vehicleIcons = {
    car: "https://d1a3f4spazzrp4.cloudfront.net/car-types/mapIconsStandard/car_go_2d.png",
    auto: "https://d1a3f4spazzrp4.cloudfront.net/car-types/mapIconsStandard/car_auto_2d.png",
    moto: "https://d1a3f4spazzrp4.cloudfront.net/car-types/mapIconsStandard/car_moto_2d.png",
  };

  const sourceIcon = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";

  const destinationIcon =
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

  // Control which InfoWindow is open
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // 'pickup' or 'destination'

  const geocodeAddress = async (address) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: apiKey,
          },
        }
      );

      if (response.data.status === "OK") {
        return response.data.results[0].geometry.location;
      } else {
        console.error("Geocoding error:", response.data.status);
        return null;
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  const drawRoute = async (pickupLoc, destinationLoc) => {
    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: pickupLoc,
      destination: destinationLoc,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    if (result.status === "OK") {
      setDirections(result);
    } else {
      console.error("Directions request failed:", result);
    }
  };

  useEffect(() => {
    const loadCoordinatesAndRoute = async () => {
      if (pickup && destination) {
        const pickupLoc = await geocodeAddress(pickup);
        const destinationLoc = await geocodeAddress(destination);

        if (pickupLoc) setPickupCoord(pickupLoc);
        if (destinationLoc) setDestinationCoord(destinationLoc);

        if (pickupLoc && destinationLoc) {
          drawRoute(pickupLoc, destinationLoc);
          if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(pickupLoc);
            bounds.extend(destinationLoc);
            map.fitBounds(bounds);
          }
        }
      }
    };

    loadCoordinatesAndRoute();
  }, [pickup, destination]);

  useEffect(() => {
    if (captainLocation && map) {
      map.panTo({
        lat: captainLocation.ltd,
        lng: captainLocation.lng,
      });
    }
  }, [captainLocation, map]);

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pickupCoord || center}
        zoom={15}
        onLoad={(map) => setMap(map)}
      >
        {/* Pickup Marker */}
        {pickupCoord && (
          <Marker
            icon={{
              url: sourceIcon,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            position={pickupCoord}
            onClick={() => setActiveInfoWindow("pickup")}
          >
            {activeInfoWindow === "pickup" && (
              <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
                <div style={{ minWidth: 150 }}>
                  <strong>📍 Pickup</strong>
                  <br />
                  <span>{pickup}</span>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoord && (
          <Marker
            icon={{
              url: destinationIcon,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            position={destinationCoord}
            onClick={() => setActiveInfoWindow("destination")}
          >
            {activeInfoWindow === "destination" && (
              <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
                <div style={{ minWidth: 150 }}>
                  <strong>🎯 Destination</strong>
                  <br />
                  <span>{destination}</span>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}

        {/* Captain Marker - Live Tracking */}
        {captainLocation && (
          <Marker
            position={{
              lat: captainLocation.ltd,
              lng: captainLocation.lng,
            }}
            icon={{
              url: vehicleIcons[vehicleType] || vehicleIcons["car"],
              scaledSize: new window.google.maps.Size(48, 48),
            }}
          />
        )}

        {/* Route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#000000",
                strokeOpacity: 0.9,
                strokeWeight: 3,
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default LiveTracking;
