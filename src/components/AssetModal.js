import React, { useState } from "react";
import { Transition } from "@headlessui/react";

const AssetModal = ({ modalOpen, setModalOpen, formData, handleInputChange, handleSubmit, editloading, locations, users }) => {
    const [filteredSublocations, setFilteredSublocations] = useState(
        locations.flatMap((loc) =>
            loc.sub_locations.map((subloc) => ({
                ...subloc,
                location_name: loc.location_name,
            }))
        )
    );

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setFilteredSublocations(
            locations.flatMap((loc) =>
                loc.sub_locations.filter(
                    (subloc) =>
                        subloc.sub_location_name.toLowerCase().includes(query) ||
                        loc.location_name.toLowerCase().includes(query)
                ).map((subloc) => ({
                    ...subloc,
                    location_name: loc.location_name,
                }))
            )
        );
    };

    return (
        <Transition show={modalOpen} className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg transform transition-all">
                    <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
                    <form className="space-y-4">
                        {/* Asset Name */}
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
                                <input
                                    type="text"
                                    placeholder="Search by location or sublocation"
                                    onChange={handleSearch}
                                    className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
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
                                <option value="">Select User</option>
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
                                className={`py-2 px-4 text-white rounded-md ${editloading
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
        </Transition>
    );
};

export default AssetModal;
