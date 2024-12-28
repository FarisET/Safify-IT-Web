import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../models/AssetType';
import { format } from 'date-fns';
import { FaUser, FaTrash, FaArrowRight, FaImage, FaEdit, FaEllipsisV } from 'react-icons/fa';
import LocationDropdown from "../components/SearchableLocationDropdown";
import AssignToDropdown from "../components/SearchableUsersDropdown";


const Assets = () => {
    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetDetails, setAssetDetails] = useState(null);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [AssetHistory, setAssetHistory] = useState([]);
    const [activeOptionsId, setActiveOptionsId] = useState(null);

    const toggleOptions = (id) => {
        setActiveOptionsId((prev) => (prev === id ? null : id));
    };

    const [activeTab, setActiveTab] = useState('Ticket History'); // Default tab
    const [loading, setLoading] = useState(false);
    const [editloading, seteditLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]); const [sublocations, setSublocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalErrorMessage, setModalErrorMessage] = useState(null);



    //Add Asset types useStates
    const [addTypeModalOpen, setaddTypeModalOpen] = useState(false);
    const [assetTypeDesc, setAssetTypeDesc] = useState("");
    const [addTypeloading, setaddTypeLoading] = useState(false);
    const [addTypeerrorMessage, setaddTypeErrorMessage] = useState("");
    const [addTypesuccessMessage, setAddTypeSuccessMessage] = useState("");

    const onCloseAddTypeModal = () => {
        setaddTypeModalOpen(false);
        setAssetTypeDesc('');
        setaddTypeErrorMessage('');
    }

    const handleAssetTypeUpdate = () => { }
    const handleAssetTypeDelete = () => {

    }

    //Add Asset useStates
    const [addAssetModalOpen, setaddAssetModalOpen] = useState(false);
    const [addAssetDesc, setAssetDesc] = useState("");
    const [addAssetName, setAssetName] = useState("");
    const [addAssetloading, setaddAssetLoading] = useState(false);
    const [addAsseterrorMessage, setaddAssetErrorMessage] = useState("");
    const [addAssetsuccessMessage, setaddAssetSuccessMessage] = useState("");

    const onCloseAddAssetModal = () => {
        setaddAssetModalOpen(false);
        setAssetName('');
        setAssetDesc('');
        setaddAssetErrorMessage('');
    }

    //Assign To
    const [AssignmodalOpen, setAssignModalOpen] = useState(false);
    const [AssignmodalMessage, setAssignModalMessage] = useState(null);
    const [assignTo, setassignTo] = useState('');
    const [assignToloading, setAssignToLoading] = useState(false);
    const [assignToerror, setassignToError] = useState(null);

    const onCloseAssignToModal = () => {
        setAssignModalMessage('')
        setAssignModalOpen(false);
        setassignTo('');
        setassignToError('');
    }



    const handleAssignToSubmit = async () => {
        setAssignModalMessage('')
        setAssignToLoading(true)
        setassignToError(null)

        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateUserAssetAssignment`,
                {
                    asset_no: selectedAsset.assetNo,
                    user_id: assignTo,
                    flag: 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setAssignModalMessage("Asset assigned successfully!");
            setTimeout(() => {
                setAssignToLoading(false);
                setAssignModalOpen(false);
                setAssignModalMessage('')
                fetchAssetDetails(selectedAsset); // Refresh asset types list
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setassignToError(error.response.data.error);
            } else {
                setassignToError("Failed to assign asset. Please try again.");
            }
        } finally {
            setAssignToLoading(false);
        }

    }


    //Unassign
    const [UnAssignmodalOpen, setUnAssignModalOpen] = useState(false);
    const [UnAssignmodalMessage, setUnAssignModalMessage] = useState(null);
    const [UnassignToloading, setUnAssignToLoading] = useState(false);
    const [UnassignToerror, setUnassignToError] = useState(null);

    const onCloseUnAssignToModal = () => {
        setUnAssignModalMessage('');
        setUnAssignModalOpen(false);
        setassignTo('');
        setUnassignToError('');
    }


    const handleUnassignSubmit = async () => {
        setUnAssignToLoading(true);
        setUnAssignModalMessage('')
        setUnassignToError('');

        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateUserAssetAssignment`,
                {
                    asset_no: selectedAsset.assetNo,
                    user_id: assignTo,
                    flag: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setUnAssignModalMessage("Asset unassigned successfully!");
            setTimeout(() => {
                setAssignToLoading(false);
                setUnAssignModalOpen(false);
                setUnAssignModalMessage('')
                fetchAssetDetails(selectedAsset); // Refresh asset types list
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setUnassignToError(error.response.data.error);
            } else {
                setUnassignToError("Failed to assign asset. Please try again.");
            }
        } finally {
            setUnAssignToLoading(false);
        }

    }


    const [formData, setFormData] = useState({
        assetNo: "",
        assetName: "",
        assetDescription: "",
        location: "",
        sublocation: "",
        sublocationId: "",
        status: "",
        assettypeId: "",

    });





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

    const handleSublocationChange = (selectedSublocationId) => {
        setFormData((prevData) => ({
            ...prevData,
            sublocation: selectedSublocationId,
        }));
    };

    const handleAddAssetType = async () => {
        setaddTypeLoading(true);
        setaddTypeErrorMessage("");
        setAddTypeSuccessMessage("");

        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                `http://localhost:3001/admin/dashboard/addAssetType`,
                { asset_type_desc: assetTypeDesc },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setAddTypeSuccessMessage("Asset type added successfully!");
            setAssetTypeDesc("");
            setTimeout(() => {
                setaddTypeModalOpen(false);
                fetchAssetTypes(); // Refresh asset types list
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setaddTypeErrorMessage(error.response.data.error);
            } else {
                setaddTypeErrorMessage("Failed to add asset type. Please try again.");
            }
        } finally {
            setaddTypeLoading(false);
        }
    };


    const handleAddAsset = async () => {
        setaddAssetLoading(true);
        setaddAssetErrorMessage("");
        setaddAssetSuccessMessage("");

        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                `http://localhost:3001/admin/dashboard/addAsset`,
                {
                    asset_name: addAssetName,
                    asset_desc: addAssetDesc,
                    asset_type_id: selectedAssetTypeId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setaddAssetSuccessMessage("Asset added successfully!");
            setAssetTypeDesc("");
            setTimeout(() => {
                setaddAssetModalOpen(false);
                fetchAssetTypes(); // Refresh asset types list
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setaddAssetErrorMessage(error.response.data.error);
            } else {
                setaddAssetErrorMessage("Failed to add asset. Please try again.");
            }
        } finally {
            setaddAssetLoading(false);
        }
    };





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


    useEffect(() => {
        fetchAssetTypes();
    },
        []);



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

            // Fetch Asset History
            const ticketHistoryResponse = await axios.get(
                `http://localhost:3001/analytics/fetchAssetLogs?asset_no=${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setTicketHistory(ticketHistoryResponse.data);
            //Fetch Ticket History
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
            assetNo: asset.asset_no,
            assetName: asset.asset_name,
            assetDescription: asset.asset_desc,
            location: asset.location_name,
            sublocation: asset.asset_location || "",
            status: asset.status,
            assettypeId: asset.asset_type_id,
        });
        fetchLocationsAndSublocations();
        fetchUsers();
        setModalOpen(true);
    };


    const handleAssignClick = (assignTo) => {
        fetchUsers();
        setassignTo(assignTo);
        setAssignModalOpen(true);
    };

    const handleUnAssignClick = (assignTo) => {
        setassignTo(assignTo);
        setUnAssignModalOpen(true);
    };





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAssignToInputChange = (input) => {
        const { value } = input;
        setassignTo(value);
    };

    const setOnEditModalClose = () => {
        formData.assetDescription = '';
        formData.assetName = '';
        formData.location = '';
        setModalOpen(false);


    }



    const handleSubmit = async () => {
        seteditLoading(true);
        setModalMessage(null);

        const payload = {
            asset_no: formData.assetNo,
            asset_name: formData.assetName,
            asset_desc: formData.assetDescription,
            asset_type_id: formData.assettypeId || null,
            asset_location: formData.sublocation,
            status: formData.asset_status || "available",
        };



        try {
            const jwtToken = sessionStorage.getItem("jwt");

            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateAsset`,
                payload,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },

                }
            );

            if (response.status === 200) {
                setModalMessage("Asset updated successfully!");
                setTimeout(() => {
                    setModalOpen(false);
                    setModalMessage(null);
                    setModalErrorMessage(null);
                    fetchAssetDetails(formData.assetNo); // Refresh the assets list
                }, 3000);
            } else {
                setModalErrorMessage(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setModalErrorMessage(`An error occurred: ${error.message}`);
        } finally {
            seteditLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="w-1/6 overflow-auto border-x">
                <div className="flex justify-between items-center p-4 border-b bg-white">
                    <h2 className="text-lg font-semibold">Asset Types</h2>
                    <button
                        type="button"
                        className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                        onClick={() => setaddTypeModalOpen(true)}
                    >
                        Add +
                    </button>
                </div>
                <ul className="p-4 space-y-2 overflow-y-auto"
                    style={{
                        maxHeight: '80vh',
                    }}>                    {assetTypes.map((type) => (
                        <li
                            key={type.assetTypeId}
                            className={`px-3 py-1 rounded flex items-center justify-between gap-2 cursor-pointer transition ${selectedAssetTypeId === type.assetTypeId ? "bg-gray-100 shadow" : "bg-white hover:bg-gray-100"
                                }`}
                            onClick={() => setSelectedAssetTypeId(type.assetTypeId)}
                        >
                            {/* Asset Type Details */}
                            <div>
                                <p className="text-sm font-medium">
                                    {type.assetTypeDesc}
                                    <span className="text-sm text-gray-500"> ({type.assets.length})</span>
                                </p>
                            </div>

                            {/* More Options Icon */}
                            {selectedAssetTypeId === type.assetTypeId && (
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent click event
                                            toggleOptions(type.assetTypeId);
                                        }}
                                        className="p-1 transition text-sm text-gray-700"
                                    >
                                        <FaEllipsisV />
                                    </button>

                                    {/* Options Card */}
                                    {activeOptionsId === type.assetTypeId && (
                                        <div className="absolute right-0 mt-2 w-20 bg-white shadow-md border rounded-md z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssetTypeUpdate(type.assetTypeId);
                                                    setActiveOptionsId(null); // Close menu
                                                }}
                                                className="block w-full text-center p-1 font-semibold text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Rename
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssetTypeDelete(type.assetTypeId);
                                                    setActiveOptionsId(null); // Close menu
                                                }}
                                                className="block w-full text-center p-1 font-semibold text-sm text-red-500 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/6 bg-white overflow-auto">
                <div className="flex justify-between items-center p-4 border-b border-b bg-gray-50">
                    <h2 className="text-lg font-semibold">Assets</h2>
                    <button
                        type="button"
                        className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                        onClick={() => setaddAssetModalOpen(true)}

                    >
                        Add +
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="🔍 Search assets..."
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                <ul className="p-4 space-y-2 overflow-y-auto"
                    style={{
                        maxHeight: '80vh',
                    }}>

                    {filteredAssets.filter(asset => asset.assetNo !== null || asset.assetName !== null || asset.assetIssueCount !== null).length > 0 ? (
                        filteredAssets
                            .filter(asset => asset.assetNo !== null || asset.assetName !== null || asset.assetIssueCount !== null)
                            .map((asset) => (
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

            <div className="w-4/6 bg-gray-50 overflow-hidden border-l flex flex-col">

                <span className='flex justify-between items-left p-4 border-b bg-white'>
                    <h2 className="text-lg font-semibold bg-white">Asset Details</h2>
                    <div className="flex space-x-4">
                        {assetDetails ? (
                            <>
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEditClick(assetDetails)}
                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                                >
                                    <span>Edit</span>
                                    <FaEdit className="text-sm" />
                                </button>

                                {/* Dispose Button */}
                                <button
                                   // onClick={() => handleDisposeClick(assetDetails)} // Add the appropriate handler function
                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    <span>Dispose</span>
                                    <FaTrash className="text-sm" />
                                </button>
                            </>
                        ) : null}
                    </div>


                </span>
                {loading ? (
                    <p className="p-4 text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : assetDetails ? (
                    <div className="p-6 bg-white rounded-md shadow-md space-y-6">

                        {/* Asset Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Asset Number */}
                            <strong className="text-gray-600 font-semibold text-sm">Asset Number</strong>
                            <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_no}</span>

                            {/* Asset Name */}
                            <strong className="text-gray-600 font-semibold text-sm">Asset Name</strong>
                            <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_name}</span>

                            {/* Description */}
                            <strong className="text-gray-600 font-semibold text-sm">Description</strong>
                            <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_desc}</span>

                            {/* Status */}
                            <strong className="text-gray-600 font-semibold text-sm">Status</strong>
                            <span
                                className={`text-sm font-medium ${assetDetails.asset_status === "available"
                                    ? "text-emerald-600"
                                    : assetDetails.asset_status === "under repair"
                                        ? "text-yellow-600"
                                        : assetDetails.asset_status === "disposed"
                                            ? "text-red-600"
                                            : assetDetails.asset_status === "in use"
                                                ? "text-sky-600"
                                                : "text-gray-800"
                                    }`}

                            >
                                {assetDetails.asset_status.charAt(0).toUpperCase() + assetDetails.asset_status.slice(1)}
                            </span>

                            {/* Creation Date */}
                            <strong className="text-gray-600 font-semibold text-sm">Creation Date</strong>
                            <span className="text-gray-800 text-sm font-medium">
                                {format(assetDetails.asset_creation_date, "MMM dd, yyyy")}
                            </span>

                            {/* Assigned To */}
                            <strong className="text-gray-600 font-semibold text-sm">Assigned To</strong>
                            <span className="text-gray-800 text-sm font-medium">
                                {assetDetails.assigned_to}

                                {assetDetails.asset_status === 'available' && (
                                    <button
                                        onClick={() => handleAssignClick(assetDetails.assigned_to)}
                                        className="ml-2 px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-emerald-200 transition"

                                    >
                                        Assign
                                    </button>
                                )}

                                {assetDetails.asset_status === 'in use' && (
                                    <button
                                        // onClick={() => handleUnassign(assetDetails.asset_id)}
                                        className="ml-2 px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-red-200 transition"
                                        onClick={() => handleUnAssignClick(assetDetails.assigned_to)}

                                    >
                                        Unassign
                                    </button>
                                )}
                            </span>

                            {/* Location */}
                            <strong className="text-gray-600 font-semibold text-sm">Location</strong>
                            <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_location} {assetDetails.location_name != 'unassigned' ? ((`(${assetDetails.location_name})`)) : null}</span>

                            {/* Is Active */}
                            <strong className="text-gray-600 font-semibold text-sm">Is Active</strong>
                            <span className="text-gray-800 text-sm font-medium">
                                {assetDetails.is_active ? "Yes" : "No"}
                            </span>
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
                                                            key={ticket.asset_log_id}
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
                                                                    "MMM dd, yyyy HH:mm:ss"
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
                                                                {format(new Date(history['Datetime']), "MMM dd, yyyy HH:mm:ss")}
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


                            {editloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {modalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{modalMessage}</p>}
                            {modalErrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{modalErrorMessage}</p>}

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
                                <LocationDropdown
                                    options={sublocations}
                                    selectedValue={formData.sublocation}
                                    onChange={handleSublocationChange}
                                />
                            </label>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setOnEditModalClose()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={editloading}
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${editloading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {AssignmodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Assign Asset</h2>
                        <form className="space-y-4">

                            {assignToloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {AssignmodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{AssignmodalMessage}</p>}
                            {assignToerror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{assignToerror}</p>}



                            {/* Assign To */}
                            <label className="block">
                                <span className="text-gray-700 text-sm">Assign To:</span>
                                <AssignToDropdown
                                    options={users} // Array of users
                                    selectedValue={assignTo} // Current selected user ID
                                    onChange={(id) => handleAssignToInputChange({ value: id })}

                                />
                            </label>




                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAssignToModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAssignToSubmit}
                                    disabled={assignToloading}
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${assignToloading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {UnAssignmodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Unassign Asset</h2>
                        <p className="text-md mb-4">Are you sure you wan't to unassign this asset?</p>
                        <form className="space-y-4">



                            {UnassignToloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {UnAssignmodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{UnAssignmodalMessage}</p>}
                            {UnassignToerror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{UnassignToerror}</p>}



                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setUnAssignModalOpen(false)}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUnassignSubmit}
                                    disabled={UnassignToloading}
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${UnassignToloading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                >
                                    Yes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {addTypeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Add Asset Type</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddAssetType();
                            }}
                        >

                            {addTypeloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {addTypesuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{addTypesuccessMessage}</p>}
                            {addTypeerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{addTypeerrorMessage}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Asset Type Description:</span>
                                <input
                                    type="text"
                                    value={assetTypeDesc}
                                    onChange={(e) => setAssetTypeDesc(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b borequiredrder-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"

                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAddTypeModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={addTypeloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${addTypeloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                    disabled={addTypeloading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addAssetModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Add Asset</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddAsset();
                            }}
                        >

                            {addAssetloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {addAssetsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{addAssetsuccessMessage}</p>}
                            {addAsseterrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{addAsseterrorMessage}</p>}

                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Asset Name:</span>
                                <input
                                    type="text"
                                    value={addAssetName}
                                    onChange={(e) => setAssetName(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>

                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Asset Description:</span>
                                <input
                                    type="text"
                                    value={addAssetDesc}
                                    onChange={(e) => setAssetDesc(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAddAssetModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={addAssetloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${addAssetloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                    disabled={addAssetloading}
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
