import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../models/AssetType';
import { format } from 'date-fns';
import { FaUser, FaTrash, FaArrowRight, FaImage, FaEdit, FaEllipsisV, FaRecycle } from 'react-icons/fa';
import LocationDropdown from "../components/SearchableLocationDropdown";
import AssignToDropdown from "../components/SearchableUsersDropdown";
import Split from "react-split";


const Assets = () => {


    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]); const [sublocations, setSublocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalErrorMessage, setModalErrorMessage] = useState(null);



    //-------------Asset types-------------
    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [selectedAssetType, setSelectedAssetType] = useState(null);


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


    //-------------Add Asset types-------------
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




    //-------------X-------------

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
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.delete(
                `http://localhost:3001/admin/dashboard/deleteAssetType/${selectedAssetTypeId}`,

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
    //----------------X------------------


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



    const onCloseUpdateTypeModal = () => {
        setUpdateTypeModalMessage('')
        setUpdateTypeModalOpen(false);
        setUpdateTypeError('');
        setUpdateTypeInput('');
        setAssetTypeDesc('');
    }




    const handleUpdateTypeSubmit = async () => {
        setUpdateTypeLoading(true);
        setUpdateTypeModalMessage('')
        setUpdateTypeError('');
        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateAssetType`,
                { asset_type_id: selectedAssetTypeId, asset_type_desc: assetTypeDesc },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setUpdateTypeModalMessage("Asset Type renamed successfully!");
            setTimeout(() => {
                setUpdateTypeLoading(false);
                setUpdateTypeModalOpen(false);
                setUpdateTypeModalMessage('');
                fetchAssetTypes();
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.error) {
                setUpdateTypeError(error.response.data.error);
            } else {
                setUpdateTypeError("Failed to rename asset. Please try again.");
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
    //----------------X------------------







    //-------------Asset and Asset Detail-------------
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    //-------
    const [assetDetails, setAssetDetails] = useState(null);
    const [ticketHistory, setTicketHistory] = useState([]);
    const [AssetHistory, setAssetHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('Ticket History'); // Default tab
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



    //-------------Add Asset-------------

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

    //-------------X-------------


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
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateLocationAssetAssignment`,
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
                fetchAssetDetails(selectedAsset); // Refresh asset types list
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


    //-------------X-------------


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

            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.put(
                `http://localhost:3001/admin/dashboard/updateLocationAssetAssignment`,
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
                fetchAssetDetails(selectedAsset); // Refresh asset types list
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


    //-------------X-------------




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

    //-------------X-------------


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

    //-------------X-------------





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


    // const handleSublocationChange = (selectedSublocationId) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         sublocation: selectedSublocationId,
    //     }));
    // };









    //-------------Fetch Users-------------


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

    //-------------X-------------

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
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.delete(
                `http://localhost:3001/admin/dashboard/deleteAsset/${selectedAsset}`,

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
    //----------------X------------------

    //DELETE Asset
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
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.delete(
                `http://localhost:3001/admin/dashboard/disposeAsset/${selectedAsset}`,

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
                fetchAssetDetails(selectedAsset);
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
    //----------------X------------------



    //-------------Edit Asset Details

    const [formData, setFormData] = useState({
        assetNo: "",
        assetName: "",
        assetDescription: "",
        status: "",
        assettypeId: "",

    });

    const setOnEditModalClose = () => {
        formData.assetDescription = '';
        formData.assetName = '';
        formData.location = '';
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
                    fetchAssetDetails(formData.assetNo); // Refresh the assets details
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

    //-------------X-------------


    return (
        <div className="bg-gray-100">
            <Split
                className="flex"
                sizes={[15, 25, 60]} // Adjust pane sizes
                minSize={150}
                expandToMin={true}
                gutterSize={7}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
            >
                <div className="h-screen border-r border-gray-200 overflow-auto border-x bg-white">
                    <div className=" flex justify-between items-center p-4 border-b bg-white">
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
                                        <span className="text-sm text-gray-500"> ({type.assets.filter(asset => asset.assetNo != null).length})</span>
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
                                                        handleUpdateTypeClick(type.assetTypeId);
                                                        setActiveOptionsId(null); // Close menu
                                                    }}
                                                    className="block w-full text-center p-1 font-semibold text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTypeClick(type.assetTypeId, type.assetTypeDesc);
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
                <div className="h-screen border-x border-gray-200 bg-white overflow-auto">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul
                        className="p-4 space-y-2 overflow-y-auto"
                        style={{
                            maxHeight: "80vh",
                        }}
                    >
                        {displayedAssets.length > 0 || displayedAssets.assetNo != null ? (
                            displayedAssets.map((asset) => (
                                <li
                                    key={asset.assetNo}
                                    className={`p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-100 ${selectedAsset?.assetNo === asset.assetNo ? "bg-gray-100" : ""
                                        }`}
                                    onClick={() => handleAssetClick(asset)}
                                >
                                    <div className="bg-gray-200 text-gray-700 flex items-center justify-center w-10 h-10 rounded-full">
                                        💻
                                    </div>
                                    <div>
                                        <p className="text-md font-semibold">{asset.assetNo}</p>
                                        <p className="text-sm">{asset.assetName}</p>
                                        <p className="text-sm text-gray-500">Issue Count: {asset.assetIssueCount}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No assets available</p>
                        )}
                    </ul>
                </div>

                <div className="h-screen border-l border-gray-200 bg-white overflow-auto flex flex-col">

                    <span className='bg-gray-50 flex justify-between items-left p-4 border-b bg-white'>
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
                                    {assetDetails.asset_status === 'available' && (

                                        <button
                                            onClick={() => handleDisposeClick(assetDetails.asset_no)} // Add the appropriate handler function
                                            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                        >
                                            <span>Dispose</span>
                                            <FaRecycle className="text-sm" />
                                        </button>)}

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteClick(assetDetails.asset_no)} // Add the appropriate handler function
                                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    >
                                        <span>Delete</span>
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
                        <div className="h-screen p-6 bg-white space-y-6">

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

                                    {(assetDetails.asset_status === 'available' && assetDetails.asset_status !== 'disposed') && (
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
                                <div className="flex items-center space-x-2">

                                    <span className="text-gray-800 text-sm font-medium">
                                        {assetDetails.asset_location} {assetDetails.location_name !== 'unassigned' ? `(${assetDetails.location_name})` : null}
                                    </span>
                                    {(assetDetails.asset_location === 'unassigned' && assetDetails.asset_status !== 'disposed') && (
                                        <button
                                            onClick={() => handleAssignToLocClick(assetDetails.location_name)}
                                            className="px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-emerald-200 transition"
                                        >
                                            Assign
                                        </button>
                                    )}
                                    {assetDetails.asset_location !== 'unassigned' && (
                                        <button
                                            // onClick={() => handleUnassign(assetDetails.asset_id)}
                                            className="ml-2 px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-red-200 transition"
                                            onClick={() => handleUnassignToLocClick(assetDetails.asset_location_id)}

                                        >
                                            Unassign
                                        </button>
                                    )}
                                </div>
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
                                            ? "border-b-2"
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
            </Split>

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

                            {/* Sublocation
                            <label className="block">
                                <span className="text-gray-700 text-sm">Sublocation:</span>
                                <LocationDropdown
                                    options={sublocations}
                                    selectedValue={formData.sublocation}
                                    onChange={handleSublocationChange}
                                />
                            </label> */}

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

            {/* Delete Asset Modal */}
            {DeletemodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Asset</h2>
                        <p className="text-md mb-4">
                            Are you sure you want to delete asset:
                            <span className="font-semibold"> {assetDetails.asset_no}</span>
                        </p>
                        <form className="space-y-4">
                            {Deleteloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {DeletemodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{DeletemodalMessage}</p>}
                            {Deleterror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{Deleterror}</p>}

                            {/* Input Field for Confirmation */}
                            <div>
                                <label htmlFor="delete-confirm" className="block text-gray-700">
                                    Type <strong className='text-red-500 font-semibold'>DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirm"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="DELETE"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseDeleteModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                {deleteInput === "DELETE" && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteSubmit}
                                        disabled={Deleteloading}
                                        className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${Deleteloading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-100 hover:bg-emerald-200"
                                            }`}
                                    >
                                        Yes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dispose Asset Modal */}
            {DisposemodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Dispose Asset</h2>
                        <p className="text-md mb-4">
                            Are you sure you want to dispose asset:
                            <span className="font-semibold"> {assetDetails.asset_no}</span>
                        </p>
                        <form className="space-y-4">
                            {Disposeloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {DisposemodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{DisposemodalMessage}</p>}
                            {Disposerror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{Disposerror}</p>}

                            {/* Input Field for Confirmation */}
                            <div>
                                <label htmlFor="delete-confirm" className="block text-gray-700">
                                    Type <strong className='text-red-500 font-semibold'>DISPOSE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirm"
                                    value={DisposeInput}
                                    onChange={(e) => setDisposeInput(e.target.value)}
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="DISPOSE"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseDisposeModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                {DisposeInput === "DISPOSE" && (
                                    <button
                                        type="button"
                                        onClick={handleDisposeSubmit}
                                        disabled={Disposeloading}
                                        className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${Disposeloading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-100 hover:bg-emerald-200"
                                            }`}
                                    >
                                        Yes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Delete Asset Type Modal */}
            {DeleteTypeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Asset Type</h2>
                        <p className="text-md mb-4">
                            Are you sure you want to delete asset type:
                            <span className="font-semibold"> {selectedAssetType}</span>
                        </p>
                        <form className="space-y-4">
                            {DeleteTypeloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {DeleteTypemodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{DeleteTypemodalMessage}</p>}
                            {DeletTypeError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{DeletTypeError}</p>}

                            {/* Input Field for Confirmation */}
                            <div>
                                <label htmlFor="delete-confirm" className="block text-gray-700">
                                    Type <strong className='text-red-500 font-semibold'>DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirm"
                                    value={deleteTypeInput}
                                    onChange={(e) => setDeleteTypeInput(e.target.value)}
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="DELETE"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseDeleteTypeModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                {deleteTypeInput === "DELETE" && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteTypeSubmit}
                                        disabled={DeleteTypeloading}
                                        className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${Deleteloading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-100 hover:bg-emerald-200"
                                            }`}
                                    >
                                        Yes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* Unassign user */}
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


            {/* Assign Location */}
            {AssignLocmodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Assign Location</h2>
                        <form className="space-y-4">

                            {assignLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {AssignLocmodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{AssignLocmodalMessage}</p>}
                            {assignLocerror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{assignLocerror}</p>}



                            {/* Assign To Location*/}
                            <label className="block">
                                <span className="text-gray-700 text-sm">Assign To:</span>
                                <LocationDropdown
                                    options={filteredSublocations} // Array of users
                                    selectedValue={assignLoc}
                                    onChange={(id) => handleAssignLocInputChange({ value: id })}



                                />
                            </label>




                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAssignLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAssignLocSubmit}
                                    disabled={assignLocloading}
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


            {/* Unassign Location */}
            {UnssignLocmodalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Unassign Location</h2>
                        <p className="text-md mb-4">Are you sure you wan't to unassign this asset?</p>
                        <form className="space-y-4">



                            {UnassignLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {UnassignLocmodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{UnassignLocmodalMessage}</p>}
                            {UnassignLocerror && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{UnassignLocerror}</p>}



                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseUnassignLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUnssignLocSubmit}
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
                                <span className="text-gray-700 text-sm">Name:</span>
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

            {UpdateTypeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Rename Asset Type</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateTypeSubmit();
                            }}
                        >

                            {UpdateTypeloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {UpdateTypemodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{UpdateTypemodalMessage}</p>}
                            {UpdateTypeError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{UpdateTypeError}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Name:</span>
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
                                    onClick={() => onCloseUpdateTypeModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={UpdateTypeloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${UpdateTypeloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                    disabled={UpdateTypeloading}
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
