import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../models/AssetType';
import { format } from 'date-fns';
import {FaUser, FaTrash, FaArrowRight, FaImage, FaEdit } from 'react-icons/fa';

const Assets = () => {
    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetDetails, setAssetDetails] = useState(null);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [AssetHistory, setAssetHistory] = useState([]);

    const [activeTab, setActiveTab] = useState('Ticket History'); // Default tab
    const [loading, setLoading] = useState(false);
    const [editloading, seteditLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]);    const [sublocations, setSublocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
      assetName: "",
      assetDescription: "",
      location: "",
      sublocation: "",
      assignTo: "",
    });


      

    useEffect(() => {
        const fetchAssetTypes = async () => {
            try {
                const jwtToken = sessionStorage.getItem('jwt');
                const response = await axios.get(
                    'http://localhost:3001/admin/dashboard/getAssetsandAssetTypes',
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                const assetTypesData = response.data.assetTypes.map((item) =>
                    AssetType.fromJson(item)
                );
                setAssetTypes(assetTypesData);

                if (assetTypesData.length > 0) {
                    setSelectedAssetTypeId(assetTypesData[0].assetTypeId);
                }
            } catch (error) {
                console.error('Error fetching asset types:', error);
            }
        };

        fetchAssetTypes();
    }, []);

    useEffect(() => {
        if (selectedAssetTypeId) {
            const selectedType = assetTypes.find(
                (type) => type.assetTypeId === selectedAssetTypeId
            );
            setFilteredAssets(selectedType ? selectedType.assets : []);
        }
    }, [selectedAssetTypeId, assetTypes]);

    const fetchAssetDetails = async (assetNo) => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = sessionStorage.getItem('jwt');

            // Fetch Asset Details
            const assetDetailsResponse = await axios.get(
                `http://localhost:3001/admin/dashboard/fetchAssetDetails/${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setAssetDetails(assetDetailsResponse.data[0]);

            // Fetch Ticket History
            const ticketHistoryResponse = await axios.get(
                `http://localhost:3001/analytics/fetchAssetIssueLogs?asset_no=${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setTicketHistory(ticketHistoryResponse.data);
            //Fetch Asset History
            const assetHistoryResponse = await axios.get(
                `http://localhost:3001/analytics/fetchAssetHistory?asset_no=${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setAssetHistory(assetHistoryResponse.data);
        } catch (error) {
            setError('Error fetching data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssetClick = (asset) => {
        setSelectedAsset(asset);
        fetchAssetDetails(asset.assetNo);
    };

    useEffect(() => {
        if (selectedAssetTypeId) {
          const selectedType = assetTypes.find(
            (type) => type.assetTypeId === selectedAssetTypeId
          );
          setFilteredAssets(selectedType ? selectedType.assets : []);
        }
      }, [selectedAssetTypeId, assetTypes]);
    
      const fetchLocationsAndSublocations = async () => {
        try {
          const jwtToken = sessionStorage.getItem("jwt");
          const response = await axios.get(
            "http://localhost:3001/helper/getLocationsAndSubLocations",
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
        } catch (error) {
          console.error("Error fetching locations and sublocations:", error);
        }
      };
      const fetchUsers = async () => {
        try {
          const jwtToken = sessionStorage.getItem("jwt");
          const response = await axios.get(
            "http://localhost:3001/admin/dashboard/fetchUsers",
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );
          setUsers(response.data.map((user) => ({ id: user.user_id, name: user.user_name })));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
    
      const handleEditClick = (asset) => {
        setSelectedAsset(asset);
        setFormData({
          assetName: asset.asset_name,
          assetDescription: asset.asset_desc,
          location: asset.location_name,
          assignTo: asset.assigned_to,
          sublocation: asset.asset_location || "",
        });
        fetchLocationsAndSublocations();
        fetchUsers();
        setModalOpen(true);
      };
      
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async () => {
        try {
          seteditLoading(true);
          const jwtToken = sessionStorage.getItem("jwt");
          const response = await axios.put(
            `http://localhost:3001/admin/dashboard/updateAsset/${selectedAsset.assetNo}`,
            formData,
            { headers: { Authorization: `Bearer ${jwtToken}` } }
          );
          alert("Asset updated successfully");
          setModalOpen(false);
        } catch (error) {
          console.error("Error updating asset:", error);
          alert("Failed to update asset");
        } finally {
          seteditLoading(false);
        }

        
      };

    return (
        <div className="flex">
            <div className="w-1/6 overflow-auto border-x">
                <h2 className="text-lg font-semibold p-4 border-b bg-white">Asset Types</h2>
                <ul className="p-2 space-y-2">
                    {assetTypes.map((type) => (
                        <li
                            key={type.assetTypeId}
                            className={`px-3 py-1 rounded flex items-center gap-2 cursor-pointer transition ${selectedAssetTypeId === type.assetTypeId
                                ? 'bg-gray-100 shadow'
                                : 'bg-white hover:bg-gray-100'
                                }`}
                            onClick={() => setSelectedAssetTypeId(type.assetTypeId)}
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {type.assetTypeDesc}
                                    <span className="text-sm text-gray-500"> ({type.assets.length})</span>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-2/6 bg-white overflow-auto">
                <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">Assets</h2>
                <ul className="p-4 space-y-2">
                    {filteredAssets.length > 0 ? (
                        filteredAssets.map((asset) => (
                            <li
                                key={asset.assetNo}
                                className={`p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-100 ${selectedAsset?.assetNo === asset.assetNo ? 'bg-gray-100' : ''}`}
                                onClick={() => handleAssetClick(asset)}
                            >
                                <div className="bg-gray-200 text-gray-700 flex items-center justify-center w-10 h-10 rounded-full">
                                    💻
                                </div>
                                <div>
                                    <p className="text-md font-semibold">{asset.assetNo}</p>
                                    <p className="text-sm">{asset.assetName}</p>
                                    <p className="text-sm text-gray-500">
                                        Issue Count: {asset.assetIssueCount}
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No assets available</p>
                    )}
                </ul>
            </div>

            <div className="w-4/6 bg-gray-50 overflow-hidden flex flex-col">
                
                <span className='flex justify-left items-left border-b bg-white'>
                <h2 className="text-lg font-semibold p-4 border-b bg-white">Asset Details</h2>
                <button onClick={() => handleEditClick(assetDetails)}> <FaEdit/> </button>
                </span>
                {loading ? (
                    <p className="p-4 text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : assetDetails ? (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>
                                <strong>Asset Number:</strong> {assetDetails.asset_no}
                            </p>
                            <p>
                                <strong>Asset Name:</strong> {assetDetails.asset_name}
                            </p>
                            <p>
                                <strong>Description:</strong> {assetDetails.asset_desc}
                            </p>
                            <p>
                                <strong>Status:</strong> {assetDetails.asset_status}
                            </p>
                            <p>
                                <strong>Creation Date:</strong>{" "}
                                {format(assetDetails.asset_creation_date, "MMM dd, yyyy")}
                            </p>
                            <p>
                                <strong>Assigned To:</strong> {assetDetails.assigned_to}
                            </p>
                            <p>
                                <strong>Location:</strong> {assetDetails.asset_location}
                            </p>
                            <p>
                                <strong>Is Active:</strong>{" "}
                                {assetDetails.is_active ? "Yes" : "No"}
                            </p>
                        </div>

                        {/* Tabs Section */}
                        <div className="mt-6">
                            <ul className="flex border-b text-sm font-medium">
                                <li
                                    className={`p-3 cursor-pointer transition-all ${activeTab === "Asset History"
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "hover:text-blue-600"
                                        }`}
                                    onClick={() => setActiveTab("Asset History")}
                                >
                                    Asset History
                                </li>
                                <li
                                    className={`p-3 cursor-pointer transition-all ${activeTab === "Ticket History"
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "hover:text-blue-600"
                                        }`}
                                    onClick={() => setActiveTab("Ticket History")}
                                >
                                    Ticket History
                                </li>
                            </ul>

                            {/* Content Section */}
                            <div className="mt-4">
                                {activeTab === "Asset History" && (
                                    <div>

                                        <div className="overflow-auto max-h-64 border rounded-lg">
                                            <table className="w-full text-left">
                                                <thead className="sticky top-0 bg-gray-100">
                                                    <tr>
                                                        <th className="p-3 text-sm text-gray-600">
                                                            ID
                                                        </th>
                                                        <th className="p-3 text-sm text-gray-600">
                                                            Action
                                                        </th>
                                                        <th className="p-3 text-sm text-gray-600">
                                                            Status
                                                        </th>
                                                        <th className="p-3 text-sm text-gray-600">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ticketHistory.map((ticket) => (
                                                        <tr
                                                            key={ticket.ticketID}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="p-3 text-sm">
                                                                {ticket.asset_log_id}
                                                            </td>
                                                            <td className="p-3 text-sm">
                                                                {ticket.action_performed}
                                                            </td>
                                                            <td className="p-3 text-sm">
                                                                {ticket.action_status}
                                                            </td>
                                                            <td className="p-3 text-sm">
                                                                {format(
                                                                    ticket.action_datetime,
                                                                    "MMM dd, yyyy"
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "Ticket History" && (
                                    <div>
                                        <div className="overflow-auto max-h-64 border rounded-lg">
                                            <table className="w-full text-left">
                                                <thead className="sticky top-0 bg-gray-100">
                                                    <tr>
                                                        <th className="p-3 text-sm text-gray-600">ID</th>
                                                        <th className="p-3 text-sm text-gray-600">Reported By</th>
                                                        <th className="p-3 text-sm text-gray-600">Problem</th>
                                                        <th className="p-3 text-sm text-gray-600">Status</th>
                                                        <th className="p-3 text-sm text-gray-600">Date</th>
                                                        <th className="p-3 text-sm text-gray-600">Location</th>
                                                        <th className="p-3 text-sm text-gray-600">Criticality</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AssetHistory.map((history, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="p-3 text-sm">{history['Report ID']}</td>
                                                            <td className="p-3 text-sm">{history['Reported by']}</td>
                                                            <td
                                                                className="p-3 text-sm overflow-hidden whitespace-nowrap max-w-[200px] cursor-pointer"
                                                                onClick={(e) => {
                                                                    const target = e.currentTarget;
                                                                    if (target.style.whiteSpace === "normal") {
                                                                        target.style.maxWidth = "200px";
                                                                    } else {
                                                                        target.style.whiteSpace = "normal";
                                                                        target.style.maxWidth = "none";
                                                                    }
                                                                }}
                                                            >
                                                                {history['Problem']}
                                                            </td>
                                                            <td className="p-3 text-sm">{history['Problem status']}</td>
                                                            <td className="p-3 text-sm">
                                                                {format(new Date(history['Datetime']), "MMM dd, yyyy")}
                                                            </td>
                                                            <td className="p-3 text-sm">{history['Location']}</td>
                                                            <td className="p-3 text-sm">{history['Problem Criticality']}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="p-4 text-gray-500">Select an asset to view details.</p>
                )}
            </div>

            {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
      <form className="space-y-4">
      <label className="block">
                                <span className="text-gray-700 text-sm">Asset Name:</span>
                                <input
                                    type="text"
                                    name="assetName"
                                    value={formData.assetName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>

                            {/* Asset Description */}
                            <label className="block">
                                <span className="text-gray-700 text-sm">Asset Description:</span>
                                <input
                                    type="text"
                                    name="assetDescription"
                                    value={formData.assetDescription}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>

        {/* Sublocation */}
        <label className="block">
          <span className="text-gray-700 text-sm">Sublocation:</span>
          <div className="relative">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by location or sublocation"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                setFilteredSublocations(
                  locations.flatMap((loc) =>
                    loc.sub_locations
                      .filter(
                        (subloc) =>
                          subloc.sub_location_name
                            .toLowerCase()
                            .includes(query) ||
                          loc.location_name.toLowerCase().includes(query)
                      )
                      .map((subloc) => ({
                        ...subloc,
                        location_name: loc.location_name,
                      }))
                  )
                );
              }}
              className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {/* Dropdown */}
            <select
              name="sublocation"
              value={formData.sublocation}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Sublocation</option>
              {filteredSublocations.map((subloc) => (
                <option key={subloc.sub_location_id} value={subloc.sub_location_id}>
                  {subloc.sub_location_name} ({subloc.location_name})
                </option>
              ))}
            </select>
          </div>
        </label>

            {/* Assign To */}
            <label className="block">
                                <span className="text-gray-700 text-sm">Assign To:</span>
                                <select
                                    name="assignTo"
                                    value={formData.assignTo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </label>



        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={editloading}
            className={`py-2 px-4 text-white rounded-md ${
              editloading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}






        </div>
    );
};

export default Assets;
