import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../../../models/AssetType';
import Split from "react-split";
import { useNavigate } from 'react-router-dom';
import { Select } from "antd";
import constants from '../../../const';
import Modals from './Modals';
import AssetTypesPanel from './AssetTypesPanel';
import AssetDetailsPanel from './AssetDetailsPanel';

const Assets = () => {
    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]);
    const [sublocations, setSublocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalErrorMessage, setModalErrorMessage] = useState(null);
    const navigate = useNavigate();

    //-------------Asset types-------------
    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [assetTypeObj, setAssetTypeObj] = useState(null);
    const [selectedAssetType, setSelectedAssetType] = useState(null);
    const [initLoading, setinitLoading] = useState(false);
    const [filterType, setFilterType] = useState('all');


    const fetchAssetTypes = async () => {
        try {
            setinitLoading(true);
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.get(
                `${constants.API.BASE_URL}/admin/dashboard/getAssetsandAssetTypes`,
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

            // if (assetTypesData.length > 0) {
            //     setSelectedAssetTypeId(assetTypesData[0].assetTypeId);
            //     setAssetTypeObj(assetTypesData[0]);
            // }
        } catch (error) {
            console.error('Error fetching asset types:', error);
        } finally {
            setinitLoading();
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


    //-------------Add Asset types-------------
    const [addTypeModalOpen, setaddTypeModalOpen] = useState(false);
    const [assetTypeDesc, setAssetTypeDesc] = useState("");
    const [addTypeloading, setaddTypeLoading] = useState(false);
    const [addTypeerrorMessage, setaddTypeErrorMessage] = useState("");
    const [addTypesuccessMessage, setAddTypeSuccessMessage] = useState("");
    const [isMacType, setIsMacType] = useState(false);


    const onCloseAddTypeModal = () => {
        setaddTypeModalOpen(false);
        setAssetTypeDesc('');
        setaddTypeErrorMessage('');
        setIsMacType(false);
    }


    const handleAddAssetType = async () => {
        setaddTypeLoading(true);
        setaddTypeErrorMessage("");
        setAddTypeSuccessMessage("");

        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.post(
                `${constants.API.BASE_URL}/admin/dashboard/addAssetType`,
                {
                    asset_type_desc: assetTypeDesc,
                    has_mac: isMacType

                },
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
                setAssetTypeDesc('');
                setIsMacType(false);
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

    //------------Delete Asset Type----------
    const [DeleteTypeModalOpen, setDeleteTypeModalOpen] = useState(false);
    const [DeleteTypemodalMessage, setDeleteTypeModalMessage] = useState(null);
    const [DeleteTypeloading, setDeleteTypeLoading] = useState(false);
    const [deleteTypeInput, setDeleteTypeInput] = useState("");
    const [DeletTypeError, setDeleteTypeError] = useState(null);

    const onCloseDeleteTypeModal = () => {
        setDeleteTypeModalMessage('')
        setDeleteTypeModalOpen(false);
        setDeleteTypeError('');
        setDeleteTypeInput('');
    }

    const handleDeleteTypeSubmit = async () => {
        setDeleteTypeLoading(true);
        setDeleteTypeModalMessage('')
        setDeleteTypeError('');
        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.delete(
                `${constants.API.BASE_URL}/admin/dashboard/deleteAssetType/${selectedAssetTypeId}`,

                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setDeleteTypeModalMessage("Asset Type deleted successfully!");
            setTimeout(() => {
                setDeleteTypeLoading(false);
                setDeleteTypeModalOpen(false);
                setDeleteTypeModalMessage('');
                fetchAssetTypes();
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setDeleteTypeError(error.response.data.error);
            } else {
                setDeleteTypeError("Failed to delete asset. Please try again.");
            }
        } finally {
            setDeleteTypeLoading(false);
        }

    }

    const handleDeleteTypeClick = (asset_type_id, asset_type) => {
        setSelectedAssetTypeId(asset_type_id);
        setSelectedAssetType(asset_type);
        setDeleteTypeModalOpen(true);
    };

    //------------Update Asset Type----------
    const [activeOptionsId, setActiveOptionsId] = useState(null); //for update asset type

    const toggleOptions = (id) => {
        setActiveOptionsId((prev) => (prev === id ? null : id));
    };

    const [UpdateTypeModalOpen, setUpdateTypeModalOpen] = useState(false);
    const [UpdateTypemodalMessage, setUpdateTypeModalMessage] = useState(null);
    const [UpdateTypeloading, setUpdateTypeLoading] = useState(false);
    const [UpdateTypeInput, setUpdateTypeInput] = useState("");
    const [UpdateTypeError, setUpdateTypeError] = useState(null);
    const [isMacTypeUpdate, setIsMacTypeUpdate] = useState(false);

    const onCloseUpdateTypeModal = () => {
        setUpdateTypeModalMessage('')
        setUpdateTypeModalOpen(false);
        setUpdateTypeError('');
        setUpdateTypeInput('');
        setAssetTypeDesc('');
        setIsMacTypeUpdate(false);
    }

    const handleUpdateTypeSubmit = async () => {
        setUpdateTypeLoading(true);
        setUpdateTypeModalMessage('')
        setUpdateTypeError('');
        try {


            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateAssetType`,
                {
                    asset_type_id: selectedAssetTypeId,
                    asset_type_desc: assetTypeDesc,
                    has_mac: isMacTypeUpdate
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setUpdateTypeModalMessage("Asset Type updated successfully!");
            setTimeout(() => {
                setUpdateTypeLoading(false);
                setUpdateTypeModalOpen(false);
                setUpdateTypeModalMessage('');
                setIsMacTypeUpdate(false);
                fetchAssetTypes();
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setUpdateTypeError(error.response.data.error);
            } else {
                setUpdateTypeError("Failed to update asset. Please try again.");
            }
        } finally {
            setUpdateTypeLoading(false);
        }

    }

    const handleUpdateTypeClick = (asset_type_id, asset_type) => {
        setSelectedAssetTypeId(asset_type_id);
        setSelectedAssetType(asset_type);
        setUpdateTypeModalOpen(true);
    };

    //-------------Asset and Asset Detail-------------
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    //-------
    const [assetDetails, setAssetDetails] = useState(null);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [AssetHistory, setAssetHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('Asset History'); // Default tab
    const [searchTerm, setSearchTerm] = useState("");

    // Filter assets based on the search term
    const displayedAssets = filteredAssets.filter(
        (asset) =>
            (asset.assetNo && asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (asset.assetName && asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (asset.assetIssueCount && asset.assetIssueCount.toString().includes(searchTerm))
    );


    const fetchAssetDetails = async (assetNo) => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = localStorage.getItem('jwt');

            // Fetch Asset Details
            const assetDetailsResponse = await axios.get(
                `${constants.API.BASE_URL}/admin/dashboard/fetchAssetDetails/${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setAssetDetails(assetDetailsResponse.data[0]);

            // Fetch Asset History
            const ticketHistoryResponse = await axios.get(
                `${constants.API.BASE_URL}/analytics/fetchAssetLogs?asset_no=${assetNo}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setTicketHistory(ticketHistoryResponse.data);
            //Fetch Ticket History
            const assetHistoryResponse = await axios.get(
                `${constants.API.BASE_URL}/analytics/fetchAssetHistory?asset_no=${assetNo}`,
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

    //-------------Add Asset-------------

    const [addAssetModalOpen, setaddAssetModalOpen] = useState(false);
    const [addAssetDesc, setAssetDesc] = useState("");
    const [addAssetMac, setAssetMac] = useState("");

    const [addAssetName, setAssetName] = useState("");
    const [addAssetloading, setaddAssetLoading] = useState(false);
    const [addAsseterrorMessage, setaddAssetErrorMessage] = useState("");
    const [addAssetsuccessMessage, setaddAssetSuccessMessage] = useState("");

    const onCloseAddAssetModal = () => {
        setaddAssetModalOpen(false);
        setAssetName('');
        setAssetDesc('');
        setaddAssetErrorMessage('');
        setAssetMac('');
    }

    const handleAddAsset = async () => {
        setaddAssetLoading(true);
        setaddAssetErrorMessage("");
        setaddAssetSuccessMessage("");

        try {

            if (addAssetMac && !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(addAssetMac.trim())) {
                setaddAssetErrorMessage('Mac Address Invalid.');
                return;
            }
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.post(
                `${constants.API.BASE_URL}/admin/dashboard/addAsset`,
                {
                    asset_name: addAssetName,
                    asset_desc: addAssetDesc,
                    asset_type_id: selectedAssetTypeId,
                    mac: addAssetMac
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

    //-------------Assign To Location-------------
    const [AssignLocmodalOpen, setLocModalOpen] = useState(false);
    const [AssignLocmodalMessage, setLocModalMessage] = useState(null);
    const [assignLoc, setassignLoc] = useState('');
    const [currentLoc, setCurrentLoc] = useState('');
    const [assignLocloading, setAssignLocLoading] = useState(false);
    const [assignLocerror, setassignLocError] = useState(null);

    const onCloseAssignLocModal = () => {
        setLocModalMessage('')
        setLocModalOpen(false);
        setassignLoc('');
        setassignLocError('');
    }

    const handleAssignLocSubmit = async () => {
        setLocModalMessage('')
        setAssignLocLoading(true)
        setassignLocError(null)

        try {


            if (assignLoc === 'unassigned' || assignLoc === 'Select a location') {
                setassignLocError('Please select a valid location');
                return;
            } else if (assignLoc === currentLoc) {
                setassignLocError(`Location already assigned to ${currentLoc}`);
                return;
            }
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateLocationAssetAssignment`,
                {
                    asset_no: selectedAsset.assetNo,
                    asset_location: assignLoc,
                    flag: 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setLocModalMessage("Location assigned successfully!");
            setTimeout(() => {
                setAssignLocLoading(false);
                setLocModalOpen(false);
                setLocModalMessage('')
                fetchAssetDetails(null);
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setassignLocError(error.response.data.error);
            } else {
                setassignLocError("Failed to assign location. Please try again.");
            }
        } finally {
            setAssignLocLoading(false);
        }

    }


    const handleAssignLocInputChange = (input) => {
        const { value } = input;
        setassignLoc(value);
    };

    const handleAssignToLocClick = (assignLoc) => {
        fetchLocationsAndSublocations();
        setassignLoc(assignLoc);
        setCurrentLoc(assignLoc)
        setLocModalOpen(true);
    };

    //-------------Unassign Location-------------
    const [UnssignLocmodalOpen, setUnassignLocModalOpen] = useState(false);
    const [UnassignLocmodalMessage, setUnassignLocModalMessage] = useState(null);
    const [UnassignLocloading, setUnassignLocLoading] = useState(false);
    const [UnassignLocerror, setUnassignLocError] = useState(null);

    const onCloseUnassignLocModal = () => {
        setUnassignLocModalMessage('')
        setUnassignLocModalOpen(false);
        setassignLoc('');
        setUnassignLocError('');
    }

    const handleUnssignLocSubmit = async () => {
        setUnassignLocModalMessage('')
        setUnassignLocLoading(true)
        setUnassignLocError(null)

        try {

            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateLocationAssetAssignment`,
                {
                    asset_no: selectedAsset.assetNo,
                    asset_location: assignLoc,
                    flag: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setUnassignLocModalMessage("Location assigned successfully!");
            setTimeout(() => {
                setUnassignLocLoading(false);
                setUnassignLocModalOpen(false);
                setUnassignLocModalMessage('')
                fetchAssetDetails(null); // Refresh asset types list
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setUnassignLocError(error.response.data.error);
            } else {
                setUnassignLocError("Failed to assign location. Please try again.");
            }
        } finally {
            setUnassignLocLoading(false);
        }

    }

    const handleUnassignToLocClick = (assignLoc) => {
        setassignLoc(assignLoc);
        setUnassignLocModalOpen(true);
    };

    //-------------Assign To User-------------
    const [AssignmodalOpen, setAssignModalOpen] = useState(false);
    const [AssignmodalMessage, setAssignModalMessage] = useState(null);
    const [assignTo, setassignTo] = useState('');
    const [currentUser, setCurrentUser] = useState('');
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

            if (assignTo === 'unassigned' || assignTo === 'Select a user') {
                setassignToError('Please select a valid user');
                return;
            } else if (assignTo === currentUser) {
                setassignToError(`${assignTo} already assigned to this asset`);
                return;
            }
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateUserAssetAssignment`,
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
                fetchAssetDetails(null); // Refresh asset types list
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

    //-------------Unassign Asset-------------
    const [UnAssignmodalOpen, setUnAssignModalOpen] = useState(false);
    const [UnAssignmodalMessage, setUnAssignModalMessage] = useState(null);
    const [UnassignToloading, setUnAssignToLoading] = useState(false);
    const [UnassignToerror, setUnassignToError] = useState(null);

    const handleUnassignSubmit = async () => {
        setUnAssignToLoading(true);
        setUnAssignModalMessage('')
        setUnassignToError('');

        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateUserAssetAssignment`,
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
                fetchAssetDetails(null); // Refresh asset types list
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

    const handleAssignClick = (assignTo) => {
        fetchUsers();
        setassignTo(assignTo);
        setCurrentUser(assignTo);
        setAssignModalOpen(true);
    };

    const handleAssignToInputChange = (input) => {
        const { value } = input;
        setassignTo(value);
    };

    //-------------Fetch Locations-------------

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
            const jwtToken = localStorage.getItem("jwt");
            const response = await axios.get(
                `${constants.API.BASE_URL}/admin/dashboard/getLocationsAndSubLocationsAdmin`,
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

    //-------------Fetch Users-------------

    const fetchUsers = async () => {
        try {
            const jwtToken = localStorage.getItem("jwt");
            const response = await axios.get(
                `${constants.API.BASE_URL}/admin/dashboard/fetchUsers`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setUsers(response.data.map((user) => ({ id: user.user_id, name: user.user_name })));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    //DELETE Asset
    const [DeletemodalOpen, setDeleteModalOpen] = useState(false);
    const [DeletemodalMessage, setDeleteModalMessage] = useState(null);
    const [Deleteloading, setDeleteLoading] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [Deleterror, setDeleteError] = useState(null);

    const onCloseDeleteModal = () => {
        setDeleteModalMessage('')
        setDeleteModalOpen(false);
        setDeleteError('');
        setDeleteInput('');
    }

    const handleDeleteSubmit = async () => {
        setDeleteLoading(true);
        setDeleteModalMessage('')
        setDeleteError('');
        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.delete(
                `${constants.API.BASE_URL}/admin/dashboard/deleteAsset/${selectedAsset}`,

                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setDeleteModalMessage("Asset deleted successfully!");
            setTimeout(() => {
                setDeleteLoading(false);
                setDeleteModalOpen(false);
                setDeleteModalMessage('')
                // fetchAssetDetails(selectedAsset); 
                setDeleteInput('');
                setSelectedAsset(null);
                fetchAssetDetails(null);
                fetchAssetTypes();
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setDeleteError(error.response.data.error);
            } else {
                setDeleteError("Failed to delete asset. Please try again.");
            }
        } finally {
            setDeleteLoading(false);
        }

    }

    const handleDeleteClick = (asset_no) => {
        setSelectedAsset(asset_no);
        setDeleteModalOpen(true);
    };

    //Dispose Asset
    const [DisposemodalOpen, setDisposeModalOpen] = useState(false);
    const [DisposemodalMessage, setDisposeModalMessage] = useState(null);
    const [Disposeloading, setDisposeLoading] = useState(false);
    const [DisposeInput, setDisposeInput] = useState("");
    const [Disposerror, setDisposeError] = useState(null);

    const onCloseDisposeModal = () => {
        setDisposeModalMessage('')
        setDisposeModalOpen(false);
        setDisposeError('');
        setDisposeInput('');
    }

    const handleDisposeSubmit = async () => {
        setDisposeLoading(true);
        setDisposeModalMessage('')
        setDisposeError('');
        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.delete(
                `${constants.API.BASE_URL}/admin/dashboard/disposeAsset/${selectedAsset}`,

                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setDisposeModalMessage("Asset disposed successfully!");
            setTimeout(() => {
                setDisposeLoading(false);
                setDisposeModalOpen(false);
                setDisposeModalMessage('')
                fetchAssetDetails(null);
                //fetchAssetTypes();
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setDisposeError(error.response.data.error);
            } else {
                setDisposeError("Failed to delete asset. Please try again.");
            }
        } finally {
            setDisposeLoading(false);
        }

    }

    const handleDisposeClick = (asset_no) => {
        setSelectedAsset(asset_no);
        setDisposeModalOpen(true);
    };

    //-------------Edit Asset Details

    const [formData, setFormData] = useState({
        assetNo: "",
        assetName: "",
        assetDescription: "",
        status: "",
        assettypeId: "",
        mac: ""

    });

    const setOnEditModalClose = () => {
        formData.assetDescription = '';
        formData.assetName = '';
        formData.location = '';
        setModalErrorMessage('');
        setModalMessage('');
        setModalOpen(false);
    }

    const handleUnAssignClick = (assignTo) => {
        setassignTo(assignTo);
        setUnAssignModalOpen(true);
    };

    const handleEditClick = (asset) => {
        setSelectedAsset(asset);
        setFormData({
            assetNo: asset.asset_no,
            assetName: asset.asset_name,
            assetDescription: asset.asset_desc,
            status: asset.status,
            assettypeId: asset.asset_type_id,
            mac: asset.mac
        });
        fetchLocationsAndSublocations();
        fetchUsers();
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [loading, setLoading] = useState(false);
    const [editloading, seteditLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        seteditLoading(true);
        setModalMessage(null);

        const payload = {
            asset_no: formData.assetNo,
            asset_name: formData.assetName,
            asset_desc: formData.assetDescription,
            asset_type_id: formData.assettypeId || null,
            status: formData.asset_status || "available",
            mac: formData.mac,


        };
        try {

            if (
                formData.mac?.trim() && // Check if `formData.mac` exists and is not empty
                formData.mac.trim() !== '-' && // Skip validation if the input is a dash
                formData.mac.trim() !== 'missing' &&
                formData.mac.trim() !== 'not required' &&
                !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(formData.mac.trim()) // Validate MAC format
            ) {
                setModalErrorMessage('Mac Address Invalid.');
                return;
            }


            const jwtToken = localStorage.getItem("jwt");

            const response = await axios.put(
                `${constants.API.BASE_URL}/admin/dashboard/updateAsset`,
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
                    fetchAssetDetails(null);
                    fetchAssetTypes(); // so if name changed, it is also reflected in Asset (middle) pane
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

    //Bulk Upload Assets
    const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleBulkUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select a file to upload.");
            return;
        }

        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const jwtToken = localStorage.getItem("jwt");
            const response = await axios.post(
                `${constants.API.BASE_URL}/admin/bulkUpload/uploadAssetSheet`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUploadMsg('Uploaded Successfully')
            handleCloseBulkUploadModal();
        } catch (error) {
            setUploadError("Failed to upload file. Please try again.");
        } finally {
            setUploadLoading(false);
        }
    };

    const handleCloseBulkUploadModal = () => {
        setBulkUploadModalOpen(false);
        setSelectedFile(null);
        setUploadError(null);
    };


    return (
        <div
            className="bg-gray-100 h-screen flex flex-col overflow-hidden">
            <Split
                className="flex"
                sizes={[15, 25, 60]}
                minSize={150}
                expandToMin={true}
                gutterSize={7}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                gutter={(index, direction) => {
                    const gutter = document.createElement('div');
                    gutter.className = `gutter ${direction === 'horizontal' ? 'cursor-ew-resize' : 'cursor-ns-resize'}`;
                    return gutter;
                }}
            >
                <AssetTypesPanel
                    filterType={filterType}
                    setFilterType={setFilterType}
                    initLoading={initLoading}
                    assetTypes={assetTypes}
                    selectedAssetTypeId={selectedAssetTypeId}
                    setSelectedAssetTypeId={setSelectedAssetTypeId}
                    setAssetTypeObj={setAssetTypeObj}
                    setaddTypeModalOpen={setaddTypeModalOpen}
                    activeOptionsId={activeOptionsId}
                    toggleOptions={toggleOptions}
                    handleUpdateTypeClick={handleUpdateTypeClick}
                    handleDeleteTypeClick={handleDeleteTypeClick}
                    setActiveOptionsId={setActiveOptionsId}
                />
                <AssetDetailsPanel
                    initLoading={initLoading}
                    displayedAssets={displayedAssets}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedAsset={selectedAsset}
                    handleAssetClick={handleAssetClick}
                    setaddAssetModalOpen={setaddAssetModalOpen}
                    navigate={navigate}
                    assetDetails={assetDetails}
                    loading={loading}
                    error={error}
                    handleEditClick={handleEditClick}
                    handleDisposeClick={handleDisposeClick}
                    handleDeleteClick={handleDeleteClick}
                    handleAssignClick={handleAssignClick}
                    handleUnAssignClick={handleUnAssignClick}
                    handleAssignToLocClick={handleAssignToLocClick}
                    handleUnassignToLocClick={handleUnassignToLocClick}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    ticketHistory={ticketHistory}
                    AssetHistory={AssetHistory}
                />
            </Split>

            <Modals
                modalOpen={modalOpen}
                AssignmodalOpen={AssignmodalOpen}
                DeletemodalOpen={DeletemodalOpen}
                DisposemodalOpen={DisposemodalOpen}
                DeleteTypeModalOpen={DeleteTypeModalOpen}
                UnAssignmodalOpen={UnAssignmodalOpen}
                AssignLocmodalOpen={AssignLocmodalOpen}
                UnssignLocmodalOpen={UnssignLocmodalOpen}
                addTypeModalOpen={addTypeModalOpen}
                UpdateTypeModalOpen={UpdateTypeModalOpen}
                addAssetModalOpen={addAssetModalOpen}
                editloading={editloading}
                modalMessage={modalMessage}
                modalErrorMessage={modalErrorMessage}
                formData={formData}
                handleInputChange={handleInputChange}
                assetTypeObj={assetTypeObj}
                setOnEditModalClose={setOnEditModalClose}
                handleSubmit={handleSubmit}
                assignToloading={assignToloading}
                AssignmodalMessage={AssignmodalMessage}
                assignToerror={assignToerror}
                users={users}
                assignTo={assignTo}
                handleAssignToInputChange={handleAssignToInputChange}
                onCloseAssignToModal={onCloseAssignToModal}
                handleAssignToSubmit={handleAssignToSubmit}
                Deleteloading={Deleteloading}
                DeletemodalMessage={DeletemodalMessage}
                Deleterror={Deleterror}
                deleteInput={deleteInput}
                setDeleteInput={setDeleteInput}
                onCloseDeleteModal={onCloseDeleteModal}
                handleDeleteSubmit={handleDeleteSubmit}
                Disposeloading={Disposeloading}
                DisposemodalMessage={DisposemodalMessage}
                Disposerror={Disposerror}
                DisposeInput={DisposeInput}
                setDisposeInput={setDisposeInput}
                onCloseDisposeModal={onCloseDisposeModal}
                handleDisposeSubmit={handleDisposeSubmit}
                DeleteTypeloading={DeleteTypeloading}
                DeleteTypemodalMessage={DeleteTypemodalMessage}
                DeletTypeError={DeletTypeError}
                deleteTypeInput={deleteTypeInput}
                setDeleteTypeInput={setDeleteTypeInput}
                onCloseDeleteTypeModal={onCloseDeleteTypeModal}
                handleDeleteTypeSubmit={handleDeleteTypeSubmit}
                UnassignToloading={UnassignToloading}
                UnAssignmodalMessage={UnAssignmodalMessage}
                UnassignToerror={UnassignToerror}
                setUnAssignModalOpen={setUnAssignModalOpen}
                handleUnassignSubmit={handleUnassignSubmit}
                assignLocloading={assignLocloading}
                AssignLocmodalMessage={AssignLocmodalMessage}
                assignLocerror={assignLocerror}
                filteredSublocations={filteredSublocations}
                assignLoc={assignLoc}
                handleAssignLocInputChange={handleAssignLocInputChange}
                onCloseAssignLocModal={onCloseAssignLocModal}
                handleAssignLocSubmit={handleAssignLocSubmit}
                UnassignLocloading={UnassignLocloading}
                UnassignLocmodalMessage={UnassignLocmodalMessage}
                UnassignLocerror={UnassignLocerror}
                onCloseUnassignLocModal={onCloseUnassignLocModal}
                handleUnssignLocSubmit={handleUnssignLocSubmit}
                handleAddAssetType={handleAddAssetType}
                addTypeloading={addTypeloading}
                addTypesuccessMessage={addTypesuccessMessage}
                addTypeerrorMessage={addTypeerrorMessage}
                assetTypeDesc={assetTypeDesc}
                setAssetTypeDesc={setAssetTypeDesc}
                isMacType={isMacType}
                setIsMacType={setIsMacType}
                onCloseAddTypeModal={onCloseAddTypeModal}
                handleUpdateTypeSubmit={handleUpdateTypeSubmit}
                UpdateTypeloading={UpdateTypeloading}
                UpdateTypemodalMessage={UpdateTypemodalMessage}
                UpdateTypeError={UpdateTypeError}
                isMacTypeUpdate={isMacTypeUpdate}
                setIsMacTypeUpdate={setIsMacTypeUpdate}
                onCloseUpdateTypeModal={onCloseUpdateTypeModal}
                handleAddAsset={handleAddAsset}
                addAssetloading={addAssetloading}
                addAssetsuccessMessage={addAssetsuccessMessage}
                addAsseterrorMessage={addAsseterrorMessage}
                addAssetName={addAssetName}
                setAssetName={setAssetName}
                addAssetDesc={addAssetDesc}
                setAssetDesc={setAssetDesc}
                addAssetMac={addAssetMac}
                setAssetMac={setAssetMac}
                onCloseAddAssetModal={onCloseAddAssetModal}
                bulkUploadModalOpen={bulkUploadModalOpen}
                handleCloseBulkUploadModal={handleCloseBulkUploadModal}
                uploadLoading={uploadLoading}
                handleBulkUpload={handleBulkUpload}
                uploadMsg={uploadMsg}
                uploadError={uploadError}
                setSelectedFile={setSelectedFile}
            />
        </div >
    );
};

export default Assets;