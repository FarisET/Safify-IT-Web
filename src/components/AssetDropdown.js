import React from "react";
import { Select } from "antd";

const { Option } = Select;

const AssetDropdown = ({ options, selectedValue, onChange }) => {
  return (
    <Select
      showSearch
      value={selectedValue}
      placeholder="Select an asset"
      onChange={onChange}
      filterOption={(input, option) =>
        option?.props.children.toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: "100%" }}
    >
      {options.map((option) => (
        <Option key={option.asset_no} value={option.asset_no}>
          {option.asset_name} ({option.asset_type_desc})
        </Option>
      ))}
    </Select>
  );
};

export default AssetDropdown;
