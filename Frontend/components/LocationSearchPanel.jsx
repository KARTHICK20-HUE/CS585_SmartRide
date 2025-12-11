/* eslint-disable react/prop-types */

import axios from "axios";

const LocationSearchPanel = ({
  suggestions,
  // setVehiclePanel,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
    }
    setPanelOpen(false);
  };

  // const handleUseCurrentLocation = async () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation is not supported by your browser.");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       try {
  //         const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json`,
  //           {
  //             params: {
  //               latlng: `${latitude},${longitude}`,
  //               key: apiKey,
  //             },
  //           }
  //         );

  //         if (
  //           response.data.status === "OK" &&
  //           response.data.results.length > 0
  //         ) {
  //           const currentAddress = response.data.results[0].formatted_address;
  //           setPickup(currentAddress);
  //           setPanelOpen(false);
  //         } else {
  //           alert("Unable to retrieve address from location.");
  //         }
  //       } catch (error) {
  //         console.error("Geolocation error:", error);
  //         alert("Failed to fetch location.");
  //       }
  //     },
  //     (error) => {
  //       console.error("Permission denied:", error);
  //       alert("Location permission is required to autofill pickup.");
  //     }
  //   );
  // };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                latlng: `${latitude},${longitude}`,
                key: apiKey,
              },
            }
          );

          if (
            response.data.status === "OK" &&
            response.data.results.length > 0
          ) {
            const currentAddress = response.data.results[0].formatted_address;

            // ⭐ UPDATE PICKUP TEXT
            setPickup(currentAddress);

            // ⭐ UPDATE PICKUP COORDINATES (THE REAL FIX)
            setPickupCoordinates({
              ltd: latitude,
              lng: longitude,
            });

            setPanelOpen(false);
          } else {
            alert("Unable to retrieve the address from location.");
          }
        } catch (error) {
          console.error("Geolocation error:", error);
          alert("Failed to fetch location.");
        }
      },
      (error) => {
        console.error("Permission denied:", error);
        alert("Location permission is required to autofill pickup.");
      }
    );
  };

  return (
    <div>
      {/* Only show for pickup */}
      {activeField === "pickup" && (
        <div
          onClick={handleUseCurrentLocation}
          className="flex gap-4 p-3 border-2 border-gray-100 hover:border-black rounded-xl items-center my-2 cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-crosshair-line"></i>
          </h2>
          <div className="flex flex-col">
            <h4 className="font-medium">Use Current Location</h4>
            <p className="text-sm text-gray-500">
              Detect your current position
            </p>
          </div>
        </div>
      )}

      {/* Display fetched suggestions */}
      {suggestions.map((suggestion, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(suggestion)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <div className="flex flex-col">
            <h4 className="font-medium">{suggestion.description}</h4>
            {suggestion.structured_formatting?.secondary_text && (
              <p className="text-sm text-gray-500">
                {suggestion.structured_formatting.secondary_text}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
