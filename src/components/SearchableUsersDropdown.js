import React, { useState } from "react";
import { Select, Input } from "antd";

const { Option } = Select;

const AssignToDropdown = ({ options, selectedValue, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered options based on search query
  const filteredOptions = options.filter(
    (option) =>
      option.name &&
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Searchable Dropdown */}
      <Select
        showSearch
        value={selectedValue}
        onChange={onChange}
        placeholder="Select a user"
        style={{ width: "100%" }}
        filterOption={false} // Disables default filtering
        onSearch={(value) => setSearchQuery(value)} // Handles search
        dropdownRender={(menu) => (
          <>
            {/* Custom Search Bar */}
            <div style={{ padding: "8px" }}>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {menu}
          </>
        )}
      >
        {/* Dropdown Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))
        ) : (
          <Option disabled>No results found</Option>
        )}
      </Select>
    </div>
  );
};

export default AssignToDropdown;
