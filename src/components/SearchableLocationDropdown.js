import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SearchableDropdown = ({ options, selectedValue, onChange }) => {
  return (
    <Select
      showSearch
      value={selectedValue}
      placeholder="Select a location"
      onChange={onChange}
      filterOption={(input, option) =>
        option?.props.children.toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: "100%" }}
    >
      {options
        .filter((option) => option.sub_location_id && option.sub_location_name) // Filter out null sublocations
        .map((option) => (
          <Option key={option.sub_location_id} value={option.sub_location_id}>
            {option.sub_location_name} ({option.location_name})
          </Option>
        ))}
    </Select>
  );
};

export default SearchableDropdown;
