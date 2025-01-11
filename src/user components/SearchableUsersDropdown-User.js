import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const AssignToDropdown = ({ options, selectedValue, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name &&
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.id === selectedValue);

  return (
    <div className="relative w-full">
      {/* Input Box */}
      <div
        className="border-b cursor-pointer shadow-sm flex justify-between items-center p-2"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{selectedOption ? selectedOption.name : "Select a user"}</span>
        <FaChevronDown />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Options */}
          <ul className="list-none p-0 m-0">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssignToDropdown;
