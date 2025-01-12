import React, { useState, useEffect } from "react";
import { Select } from "antd";
import LocationDropdown from "../../components/SearchableLocationDropdown";
import axios from 'axios';
import AssetDropdown from "../../components/AssetDropdown";
import { useNavigate } from 'react-router-dom';


const TicketForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    criticality: "low",
    sublocId: null,
    assetNo: null
  });

  const handleFormClose = () => {
    setFormData({
      assetNo: null,
      sublocId: null,
      criticality: "",
      description: "",
    });
    setSubmitTicketError('');
    setSubmitTicketMessage('');
  }

  const { Option } = Select;
  const navigate = useNavigate();

  //Fetch Location
  const [locations, setLocations] = useState([]);
  const [filteredSublocations, setFilteredSublocations] = useState([]);
  const [sublocations, setSublocations] = useState([]);
  const [role, setRole] = useState(sessionStorage.getItem("role"))

  useEffect(() => {
    // Flatten sublocations for dropdown
    const flattenedSublocations = locations.flatMap((loc) =>
      loc.sub_locations.map((subloc) => ({
        ...subloc,
        location_name: loc.location_name,
      }))
    );
    setSublocations(flattenedSublocations);
  }, [locations]);

  const fetchLocationsAndSublocations = async () => {
    try {
      const jwtToken = sessionStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:3001/ticket/dashboard/getLocationsAndSubLocations",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      const data = response.data;

      setLocations(data.locations);

      // Flatten sublocations with location names for filtering
      const sublocations = data.locations.flatMap((loc) =>
        loc.sub_locations.map((subloc) => ({
          ...subloc,
          location_name: loc.location_name,
        }))
      );
      setFilteredSublocations(sublocations);
    }
    catch (error) {
      console.error("Error fetching locations and sublocations:", error);
    }
  };

  //Fetch Assigned Assets

  const [assetTypes, setAssetTypes] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const flattenedSublocations = locations.flatMap((loc) =>
      loc.sub_locations.map((subloc) => ({
        ...subloc,
        location_name: loc.location_name,
      }))
    );
    setSublocations(flattenedSublocations);
  }, [locations]);


  const fetchAssetTypesAndAssets = async () => {
    try {
      const jwtToken = sessionStorage.getItem("jwt");
      const userId = sessionStorage.getItem("userId");

      const response = await axios.get(
        `http://localhost:3001/ticket/dashboard/getAssetsandAssetTypes/${userId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      const data = response.data;
      setAssetTypes(data.assetTypes);

      // Flatten assets with asset type descriptions for filtering
      const flattenedAssets = data.assetTypes.flatMap((type) =>
        type.assets.map((asset) => ({
          ...asset,
          asset_type_desc: type.asset_type_desc,
        }))
      );
      setAssets(flattenedAssets);
      setFilteredAssets(flattenedAssets); // Initially show all assets
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Submit Form
  const [submitTicketLoading, setSubmitTicketLoading] = useState(false);
  const [submitTicketMessage, setSubmitTicketMessage] = useState("");
  const [submitTicketError, setSubmitTicketError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current date-time in ISO format (can adjust as needed)
    const dateTime = new Date().toISOString();

    // Prepare the data to send
    const data = {
      report_description: formData.description,
      date_time: dateTime,
      asset_no: formData.assetNo,
      sub_location_id: formData.sublocId,
      incident_criticality_id: formData.criticality,
    };

    try {
      setSubmitTicketLoading(true);

      const userId = sessionStorage.getItem("userId");

      // Send the data to the backend using axios
      const response = await axios.post(
        `http://localhost:3001/ticket/dashboard/${userId}/MakeReport`,
        data,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`, // Add JWT token for authorization
          },
        }
      );

      // Handle successful submission
      if (response.status === 200) {
        setSubmitTicketMessage("Ticket Submitted Successfully!");

        // Delay navigation to allow the success message to be visible
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/tickets');
          } else if (role === 'user') {
            navigate('/user-portal');
          } else if (role === 'action_team') {
            navigate('/action-team-portal');
          } else {
            navigate('/404');
          }

          // Reset form after navigation
          handleFormClose();
        }, 3000);
      }

    } catch (error) {
      setSubmitTicketError("Failed to launch ticket. Please try again");
      // Handle error (e.g., show an error message to the user)
    } finally {

    }
  };

  const onCanel = () => {
    handleFormClose();
    setTimeout(() => {
      if (role == 'admin') {
        navigate('/tickets');
      } else if (role == 'user') {
        navigate('/user-portal');

      } else if (role == 'action_team') {
        navigate('/action-team-portal')
      } else {
        navigate('/404')
      }
    }, 4000)

  }


  useEffect(() => {
    fetchLocationsAndSublocations();
    fetchAssetTypesAndAssets();
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Submit a Ticket</h1>

      {submitTicketLoading && (
        <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>
      )}
      {submitTicketMessage && (
        <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">
          {submitTicketMessage}
        </p>
      )}
      {submitTicketError && (
        <p className="mb-4 p-3 rounded text-red-600 bg-red-100">
          {submitTicketError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg">




        <div className="flex flex-col gap-6">
          {/* Asset Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Select Asset</label>
            <AssetDropdown
              options={filteredAssets}
              selectedValue={formData.assetNo}
              onChange={(value) => handleChange({ target: { name: "assetNo", value } })}
            />
          </div>

          {/* Location Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Select Location</label>
            <LocationDropdown
              options={filteredSublocations}
              selectedValue={formData.sublocId}
              onChange={(value) => handleChange({ target: { name: "sublocId", value } })}
            />
          </div>

          {/* Radio Buttons */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Criticality</label>
            <div className="flex gap-4">
              {[
                { label: "Low", value: "CRT1" },
                { label: "High", value: "CRT2" },
                { label: "Critical", value: "CRT3" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="criticality"
                    value={option.value} // Set value as CRT1, CRT2, CRT3
                    checked={formData.criticality === option.value}
                    onChange={handleChange}
                    className="focus:ring-sky-500"
                  />
                  {option.label} {/* Display with first letter capitalized */}
                </label>
              ))}
            </div>
          </div>



          {/* Description Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
            >
              Submit Ticket
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default TicketForm;
