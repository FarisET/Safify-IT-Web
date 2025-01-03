import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Split from "react-split";

const LocationsDirectory = () => {
    const [locations, setLocations] = useState([]);
    const [filteredSublocations, setFilteredSublocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch locations and sublocations on component mount
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

    return (
        <div className="h-screen overflow-hidden border-x bg-gray-100">
            {/* Split Pane Layout */}
            <Split
                className="flex"
                sizes={[25, 75]} // Adjust pane sizes
                minSize={150}
                expandToMin={true}
                gutterSize={7}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
            >
                {/* Left Pane: Locations List */}
                <div className="h-screen border-r border-gray-200 bg-white overflow-y-auto">
                    <h2 className="text-lg font-semibold p-4 border-b">Locations</h2>
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
                                {location.location_name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Pane: Sublocations Table */}
                <div className="border-l border-gray-200 h-screen bg-white overflow-auto">
                    <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">
                        Sublocations Directory
                    </h2>
                    <div className="p-4 text-gray-700">
                        <span>Total: {filteredSublocations.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="🔍 Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border rounded px-4 py-2 w-1/3"
                        />
                        {/* Add Sublocation Button */}
                        <button className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition">
                            Add +
                        </button>
                    </div>

                    {/* Sublocations Table */}
                    <div className="overflow-x-auto bg-white p-4">
                        <table className="table-auto w-full shadow-md rounded-md overflow-hidden">
                            <thead className="text-black text-left">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">
                                        Sublocation ID
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">
                                        Sublocation Name
                                    </th>
                                    <th className="px-6 py-3 text-center font-medium text-gray-600 border-b w-1/4">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSublocations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-3 text-center text-gray-500"
                                        >
                                            No sublocations found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSublocations.map((sublocation) => (
                                        <tr
                                            key={sublocation.sub_location_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-3 border-b">
                                                {sublocation.sub_location_id}
                                            </td>
                                            <td className="px-6 py-3 border-b">
                                                {sublocation.sub_location_name}
                                            </td>
                                            <td className="px-6 py-3 border-b flex justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        console.log("Edit sublocation", sublocation.sub_location_id)
                                                    }
                                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                                                >
                                                    <span>Edit</span>
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        console.log("Delete sublocation", sublocation.sub_location_id)
                                                    }
                                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                                                >
                                                    <span>Delete</span>
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
        </div>
    );
};

export default LocationsDirectory;
