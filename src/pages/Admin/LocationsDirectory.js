import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaEllipsisH, FaEllipsisV, FaTrash } from "react-icons/fa";
import Split from "react-split";

const LocationsDirectory = () => {
    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedSubLocation, setSelectedSubLocation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch locations and sublocations on component mount
    const fetchLocationsAndSublocations = async () => {
        try {
            const jwtToken = sessionStorage.getItem("jwt");
            const response = await axios.get(
                "http://localhost:3001/admin/dashboard/getLocationsAndSubLocationsAdmin",
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            const data = response.data;
            setLocations(data.locations);

            // Select the first location by default and show its sublocations
            if (data.locations.length > 0) {
                const defaultLocation = data.locations[0];
                setSelectedLocation(defaultLocation);
                setFilteredSublocations(
                    defaultLocation.sub_locations.map((subloc) => ({
                        ...subloc,
                        location_name: defaultLocation.location_name,
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching locations and sublocations:", error);
        }
    };

    // Handle location selection
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setSearchTerm(""); // Clear the search term when switching locations
        setFilteredSublocations(
            location.sub_locations.map((subloc) => ({
                ...subloc,
                location_name: location.location_name,
            }))
        );
    };

    // Filter sublocations based on search term
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        // Filter based on the sublocations of the selected location
        const filtered = selectedLocation.sub_locations.filter(
            (subloc) =>
                subloc.sub_location_name.toLowerCase().includes(term) ||
                selectedLocation.location_name.toLowerCase().includes(term)
        );

        setFilteredSublocations(
            filtered.map((subloc) => ({
                ...subloc,
                location_name: selectedLocation.location_name,
            }))
        );
    };

    // Fetch locations on component mount
    useEffect(() => {
        fetchLocationsAndSublocations();
    }, []);

    //Add Location
    const [addLocationModalOpen, setaddLocationModalOpen] = useState(false);
    const [locName, setLocName] = useState("");
    const [addLocloading, setaddLocLoading] = useState(false);
    const [addLocerrorMessage, setaddLocErrorMessage] = useState("");
    const [addLocsuccessMessage, setAddLocSuccessMessage] = useState("");

    const onCloseAddLocModal = () => {
        setaddLocationModalOpen(false);
        setLocName('');
        setaddLocErrorMessage('');
        setAddLocSuccessMessage('');

    }

    //Add Sub Loc
    const [addSubLocationModalOpen, setaddsubLocationModalOpen] = useState(false);
    const [subLocName, setSubLocName] = useState("");
    const [addsubLocloading, setaddsubLocLoading] = useState(false);
    const [addsubLocerrorMessage, setaddsubLocErrorMessage] = useState("");
    const [addsubLocsuccessMessage, setAddsubLocSuccessMessage] = useState("");

    const onCloseAddSubLocModal = () => {
        setaddsubLocationModalOpen(false);
        setSubLocName('');
        setaddsubLocErrorMessage('');
        setAddsubLocSuccessMessage('');

    }




    // Common handler to add location or sublocation
    const handleAddLocationOrSubLocation = async (isSubLocation = false) => {
        const jwtToken = sessionStorage.getItem("jwt");
        const payload = isSubLocation
            ? {
                location_name: null,
                sub_location_name: subLocName,
                location_id: selectedLocation?.location_id,
            }
            : {
                location_name: locName,
                sub_location_name: null,
                location_id: null,
            };

        try {

            if (isSubLocation) {
                setaddsubLocLoading(true);
            } else {
                setaddLocLoading(true);
            }
            const response = await axios.post(
                "http://localhost:3001/admin/dashboard/addLocationOrSubLocation",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (isSubLocation) {
                setAddsubLocSuccessMessage("Sub location added successfully!");
                setSubLocName("");
                setTimeout(() => {
                    setaddsubLocationModalOpen(false);
                    setaddsubLocErrorMessage('');
                    setAddsubLocSuccessMessage('');

                }, 2000);

            } else {
                setAddLocSuccessMessage("Location added successfully!");
                setLocName("");
                setTimeout(() => {
                    setaddLocationModalOpen(false);
                    setaddLocErrorMessage('');
                    setAddLocSuccessMessage('');

                }, 2000);

            }
            fetchLocationsAndSublocations();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to add. Please try again.";
            if (isSubLocation) {
                setaddsubLocErrorMessage(errorMsg);
            } else {
                setaddLocErrorMessage(errorMsg);
            }
        } finally {
            if (isSubLocation) {
                setaddsubLocLoading(false);
            } else {
                setaddLocLoading(false);
            }
        }
    };

    //Update Location
    const [activeOptionsId, setActiveOptionsId] = useState(null); //for update asset type

    const toggleOptions = (id) => {
        setActiveOptionsId((prev) => (prev === id ? null : id));
    };

    const [updateLocationModalOpen, setupdateLocationModalOpen] = useState(false);
    const [updateLocloading, setupdateLocLoading] = useState(false);
    const [newlocName, setnewlocName] = useState('');
    const [updateLocerrorMessage, setupdateLocErrorMessage] = useState("");
    const [updateLocsuccessMessage, setupdateLocSuccessMessage] = useState("");

    const onCloseUpdateLocModal = () => {
        setupdateLocationModalOpen(false);
        setLocName('');
        setnewlocName('');
        setupdateLocErrorMessage('');
        setupdateLocSuccessMessage('');
    }

    const handleUpdateOnClick = (loc) => {
        setupdateLocationModalOpen(true);
        setSelectedLocation(loc);
    }




    const handleUpdateLocation = async () => {
        const jwtToken = sessionStorage.getItem("jwt");
        const payload =
        {
            location_name: newlocName,
            location_id: selectedLocation?.location_id,
        }

        try {
            if (newlocName === '') {
                setupdateLocErrorMessage("Please enter a valid name to update.");
                return;
            } else if (newlocName === selectedLocation.location_name) {
                setupdateLocErrorMessage("Please enter a different name to update.");
                return;
            }

            setupdateLocLoading(true);

            const response = await axios.put(
                "http://localhost:3001/admin/dashboard/updateLocation",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );


            setupdateLocSuccessMessage("Location added successfully!");
            setLocName("");
            setTimeout(() => {
                setupdateLocationModalOpen(false);
                setupdateLocErrorMessage('');
                setupdateLocSuccessMessage('');

            }, 2000);


            fetchLocationsAndSublocations();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to rename. Please try again.";
            setupdateLocErrorMessage(errorMsg);

        } finally {
            setupdateLocLoading(false);
        }
    };

    // Delete Location

    const [deleteLocationModalOpen, setdeleteLocationModalOpen] = useState(false);
    const [deleteLocloading, setdeleteLocLoading] = useState(false);
    const [deleteLocerrorMessage, setdeleteLocErrorMessage] = useState("");
    const [deleteLocsuccessMessage, setdeleteLocSuccessMessage] = useState("");
    const [deleteLocInput, setDeleteLocInput] = useState("");

    const onCloseDeleteLocModal = () => {
        setdeleteLocationModalOpen(false);
        setupdateLocErrorMessage('');
        setupdateLocSuccessMessage('');
        setDeleteLocInput('');
        setdeleteLocLoading(false);


    }

    const handleDeleteClick = (loc) => {
        setdeleteLocationModalOpen(true);
        setSelectedLocation(loc);
        setdeleteLocErrorMessage('');
        setdeleteLocSuccessMessage('');
    }




    const handleDeleteLocation = async () => {
        const jwtToken = sessionStorage.getItem("jwt");

        try {


            setdeleteLocLoading(true);

            const response = await axios.delete(
                `http://localhost:3001/admin/dashboard/deleteLocation/${selectedLocation.location_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );


            setdeleteLocSuccessMessage("Location deleted successfully!");
            setTimeout(() => {
                setdeleteLocationModalOpen(false);
                setupdateLocSuccessMessage('');
                setdeleteLocErrorMessage('');
                setDeleteLocInput('');

            }, 2000);


            fetchLocationsAndSublocations();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to delete. Please try again.";
            setdeleteLocErrorMessage(errorMsg);

        } finally {
            setdeleteLocLoading(false);
        }
    };


    //Update Sub-Location


    const [updateSubLocationModalOpen, setupdateSubLocationModalOpen] = useState(false);
    const [updateSubLocloading, setupdateSubLocLoading] = useState(false);
    const [newSubLocName, setnewSubLocName] = useState('');
    const [updateSubLocerrorMessage, setupdateSubLocErrorMessage] = useState("");
    const [updateSubLocsuccessMessage, setupdateSubLocSuccessMessage] = useState("");

    const onCloseUpdateSubLocModal = () => {
        setupdateSubLocationModalOpen(false);
        setupdateSubLocLoading(false);
        setSubLocName('');
        setnewSubLocName('');
        setupdateSubLocErrorMessage('');
        setupdateSubLocSuccessMessage('');
    }

    const handleSubLocUpdateOnClick = (subLoc) => {
        setupdateSubLocationModalOpen(true);
        setSelectedSubLocation(subLoc);
    }




    const handleUpdateSubLocation = async () => {
        const jwtToken = sessionStorage.getItem("jwt");
        const payload =
        {
            sub_location_name: newSubLocName,
            sub_location_id: selectedSubLocation?.sub_location_id,
            location_id: selectedLocation?.location_id,
        }

        try {
            if (newSubLocName === '') {
                setupdateSubLocErrorMessage("Please enter a valid name to update.");
                return;
            } else if (newSubLocName === selectedSubLocation.sub_location_name) {
                setupdateSubLocErrorMessage("Please enter a different name to update.");
                return;
            }

            setupdateSubLocLoading(true);

            const response = await axios.put(
                "http://localhost:3001/admin/dashboard/updateSubLocation",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );


            setupdateSubLocSuccessMessage("Sub Location added successfully!");
            setnewSubLocName("");
            setTimeout(() => {
                setupdateSubLocationModalOpen(false);
                setupdateSubLocErrorMessage('');
                setupdateSubLocSuccessMessage('');

            }, 2000);


            fetchLocationsAndSublocations();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to rename. Please try again.";
            setupdateSubLocErrorMessage(errorMsg);

        } finally {
            setupdateSubLocLoading(false);
        }
    };

    // Delete Sub Location

    const [deleteSubLocationModalOpen, setdeleteSubLocationModalOpen] = useState(false);
    const [deleteSubLocloading, setdeleteSubLocLoading] = useState(false);
    const [deleteSubLocerrorMessage, setdeleteSubLocErrorMessage] = useState("");
    const [deleteSubLocsuccessMessage, setdeleteSubLocSuccessMessage] = useState("");
    const [deleteSubLocInput, setDeleteSubLocInput] = useState("");

    const onCloseDeleteSubLocModal = () => {
        setdeleteSubLocationModalOpen(false);
        setupdateSubLocErrorMessage('');
        setupdateSubLocSuccessMessage('');
        setDeleteSubLocInput('');
        setdeleteSubLocLoading(false);

    }

    const handleSubLocDeleteClick = (loc) => {
        setdeleteSubLocationModalOpen(true);
        setSelectedSubLocation(loc);
        setdeleteSubLocErrorMessage('');
        setdeleteSubLocSuccessMessage('');
    }




    const handleDeleteSubLocation = async () => {
        const jwtToken = sessionStorage.getItem("jwt");


        try {


            setdeleteLocLoading(true);

            const response = await axios.delete(
                `http://localhost:3001/admin/dashboard/deleteSubLocation/${selectedSubLocation.sub_location_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );


            setdeleteSubLocSuccessMessage("Location deleted successfully!");
            setTimeout(() => {
                setdeleteSubLocationModalOpen(false);
                setupdateSubLocSuccessMessage('');
                setdeleteSubLocErrorMessage('');
                setDeleteSubLocInput('');

            }, 2000);


            fetchLocationsAndSublocations();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to delete. Please try again.";
            setdeleteSubLocErrorMessage(errorMsg);

        } finally {
            setdeleteSubLocLoading(false);
        }
    };





    return (
        <div className="h-screen overflow-hidden border-x bg-gray-100">
            <Split
                className="flex"
                sizes={[15, 85]}
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
                <div className="h-screen border-r border-gray-200 bg-white overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b bg-white">
                        <h2 className="text-lg font-semibold">Locations
                            <span className="text-sm text-gray-500"> ({locations.length})</span>

                        </h2>

                        <button
                            type="button"
                            className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                            onClick={() => setaddLocationModalOpen(true)}
                        >
                            Add +
                        </button>
                    </div>
                    <ul className="p-4 space-y-2">
                        {locations.map((location) => (
                            <li
                                key={location.location_id}
                                className={`px-3 py-1 rounded flex items-center justify-between gap-2 cursor-pointer transition ${selectedLocation?.location_id === location.location_id
                                    ? "bg-gray-100 shadow"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                                onClick={() => handleLocationSelect(location)}
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {location.location_name}
                                        <span className="text-sm text-gray-500"> ({location.sub_locations.filter(loc => loc.sub_location_id != null).length})</span>
                                    </p>
                                </div>

                                {/* More Options Icon */}
                                {selectedLocation.location_id === location.location_id && (
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent click event
                                                toggleOptions(location.location_id);
                                            }}
                                            className="p-1 transition text-sm text-gray-700"
                                        >
                                            <FaEllipsisH />
                                        </button>

                                        {/* Options Card */}
                                        {activeOptionsId === location.location_id && (
                                            <div className="absolute right-0 mt-2 w-20 bg-white shadow-md border rounded-md z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateOnClick(location);
                                                        setActiveOptionsId(null); // Close menu
                                                    }}
                                                    className="block w-full text-center p-1 font-semibold text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(location);
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

                <div className="border-l border-gray-200 h-screen bg-white overflow-auto">
                    <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">Sub Locations Directory</h2>
                    <div className="p-4 text-gray-700">
                        <span>Total: {filteredSublocations.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <input
                            type="text"
                            placeholder="🔍 Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border rounded px-4 py-2 w-1/3"
                        />
                        <button
                            className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                            onClick={() => setaddsubLocationModalOpen(true)}
                        >
                            Add +
                        </button>
                    </div>

                    <div className="overflow-x-auto bg-white p-4">
                        <table className="table-auto w-full shadow-md rounded-md overflow-hidden">
                            <thead className="text-black text-left">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">Sublocation ID</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">Sublocation Name</th>
                                    <th className="px-6 py-3 text-center font-medium text-gray-600 border-b w-1/4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSublocations.length === 0 || filteredSublocations.some((sublocation) => sublocation.sub_location_id === null) ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                                            No sublocations found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSublocations.map((sublocation) => (
                                        <tr key={sublocation.sub_location_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 border-b">{sublocation.sub_location_id}</td>
                                            <td className="px-6 py-3 border-b">{sublocation.sub_location_name}</td>
                                            <td className="px-6 py-3 border-b flex justify-end space-x-2">
                                                <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                                                    onClick={() => handleSubLocUpdateOnClick(sublocation)}
                                                >
                                                    <span
                                                    >Edit</span>
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                                    onClick={() => handleSubLocDeleteClick(sublocation)}
                                                >
                                                    <span
                                                    >Delete</span>
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Split>

            {addLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Add Location</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddLocationOrSubLocation();
                            }}
                        >

                            {addLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {addLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{addLocsuccessMessage}</p>}
                            {addLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{addLocerrorMessage}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Name:</span>
                                <input
                                    type="text"
                                    value={locName}
                                    onChange={(e) => setLocName(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b borequiredrder-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAddLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={addLocloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${addLocloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"}`}
                                    disabled={addLocloading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addSubLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Add Sub Location</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddLocationOrSubLocation(true);
                            }}
                        >

                            {addsubLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {addsubLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{addsubLocsuccessMessage}</p>}
                            {addsubLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{addsubLocerrorMessage}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Name:</span>
                                <input
                                    type="text"
                                    value={subLocName}
                                    onChange={(e) => setSubLocName(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b borequiredrder-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseAddSubLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={addsubLocloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${addsubLocloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"}`}
                                    disabled={addsubLocloading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update */}

            {updateLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Rename Location</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateLocation();
                            }}
                        >

                            {updateLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {updateLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{updateLocsuccessMessage}</p>}
                            {updateLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{updateLocerrorMessage}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Name:</span>
                                <input
                                    type="text"
                                    value={newlocName}
                                    onChange={(e) => setnewlocName(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b borequiredrder-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseUpdateLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={updateLocloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${updateLocloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                    disabled={updateLocloading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {updateSubLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Rename Sub Location</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateSubLocation();
                            }}
                        >

                            {updateSubLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {updateSubLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{updateSubLocsuccessMessage}</p>}
                            {updateSubLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{updateSubLocerrorMessage}</p>}


                            <label className="block mb-4">
                                <span className="text-gray-700 text-sm">Name:</span>
                                <input
                                    type="text"
                                    value={newSubLocName}
                                    onChange={(e) => setnewSubLocName(e.target.value)}
                                    className="m-1 block w-full rounded-md border-b borequiredrder-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2"
                                    required
                                />
                            </label>


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseUpdateSubLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                    disabled={updateSubLocloading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${updateSubLocloading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-emerald-200"
                                        }`}
                                    disabled={updateSubLocloading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* Delete*/}
            {deleteLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Location</h2>
                        <p className="text-md mb-4">
                            Are you sure you want to delete location:
                            <span className="font-semibold"> {selectedLocation.location_name}</span>
                        </p>
                        <form className="space-y-4">
                            {deleteLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {deleteLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{deleteLocsuccessMessage}</p>}
                            {deleteLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{deleteLocerrorMessage}</p>}

                            {/* Input Field for Confirmation */}
                            <div>
                                <label htmlFor="delete-confirm" className="block text-gray-700">
                                    Type <strong className='text-red-500 font-semibold'>DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirm"
                                    value={deleteLocInput}
                                    onChange={(e) => setDeleteLocInput(e.target.value)}
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="DELETE"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseDeleteLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                {deleteLocInput === "DELETE" && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteLocation}
                                        disabled={deleteLocloading}
                                        className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${deleteLocloading
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


            {deleteSubLocationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Delete Sub Location</h2>
                        <p className="text-md mb-4">
                            Are you sure you want to delete sub location:
                            <span className="font-semibold"> {selectedSubLocation.sub_location_name}</span>
                        </p>
                        <form className="space-y-4">
                            {deleteSubLocloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
                            {deleteSubLocsuccessMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{deleteSubLocsuccessMessage}</p>}
                            {deleteSubLocerrorMessage && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{deleteSubLocerrorMessage}</p>}

                            {/* Input Field for Confirmation */}
                            <div>
                                <label htmlFor="delete-confirm" className="block text-gray-700">
                                    Type <strong className='text-red-500 font-semibold'>DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirm"
                                    value={deleteSubLocInput}
                                    onChange={(e) => setDeleteSubLocInput(e.target.value)}
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="DELETE"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => onCloseDeleteSubLocModal()}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                >
                                    No
                                </button>
                                {deleteSubLocInput === "DELETE" && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteSubLocation}
                                        disabled={deleteSubLocloading}
                                        className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${deleteSubLocloading
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





        </div>
    );
};

export default LocationsDirectory;
