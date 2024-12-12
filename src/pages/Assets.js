import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../models/AssetType';
import { format } from 'date-fns';

const Assets = () => {
    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetDetails, setAssetDetails] = useState(null);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('Ticket History'); // Default tab
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    return (
        <div className="flex h-screen">
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
                                    <p className="text-md">{asset.assetName}</p>
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

            <div className="w-full md:w-3/6 bg-gray-50 overflow-hidden flex flex-col">
                <h2 className="text-lg font-semibold p-4 border-b bg-white">Asset Details</h2>
                {loading ? (
                    <p className="p-4 text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : assetDetails ? (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <strong>Asset Assignment:</strong> {assetDetails.assigned_to}
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
                                    className={`p-3 cursor-pointer transition-all ${activeTab === "Ticket History"
                                            ? "border-b-2 border-blue-500 text-blue-600"
                                            : "hover:text-blue-600"
                                        }`}
                                    onClick={() => setActiveTab("Ticket History")}
                                >
                                    Ticket History
                                </li>
                                <li
                                    className={`p-3 cursor-pointer transition-all ${activeTab === "Asset History"
                                            ? "border-b-2 border-blue-500 text-blue-600"
                                            : "hover:text-blue-600"
                                        }`}
                                    onClick={() => setActiveTab("Asset History")}
                                >
                                    Asset History
                                </li>
                            </ul>

                            {/* Content Section */}
                            <div className="mt-4">
                                {activeTab === "Ticket History" && (
                                    <div>
        
                                        <div className="overflow-auto max-h-64 border rounded-lg">
                                            <table className="w-full text-left">
                                                <thead className="sticky top-0 bg-gray-100">
                                                    <tr>
                                                        <th className="p-3 text-sm text-gray-600">
                                                            Log ID
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
                                {activeTab === "Asset History" && (
                                    <div>

                                        <p className="text-gray-500">No data available yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="p-4 text-gray-500">Select an asset to view details.</p>
                )}
            </div>


        </div>
    );
};

export default Assets;
