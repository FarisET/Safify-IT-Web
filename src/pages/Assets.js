import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AssetType } from '../models/AssetType';

const Assets = () => {
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
  const [filteredAssets, setFilteredAssets] = useState([]);

  useEffect(() => {
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

        // Select the first asset type by default
        if (assetTypesData.length > 0) {
          setSelectedAssetTypeId(assetTypesData[0].assetTypeId);
        }
      } catch (error) {
        console.error('Error fetching asset types:', error);
      }
    };

    fetchAssetTypes();
  }, []);

  useEffect(() => {
    if (selectedAssetTypeId) {
      const selectedType = assetTypes.find(
        (type) => type.assetTypeId === selectedAssetTypeId
      );
      setFilteredAssets(selectedType ? selectedType.assets : []);
    }
  }, [selectedAssetTypeId, assetTypes]);

  return (
    <div className="flex h-screen">
      {/* Asset Type Pane */}
      <div className="w-1/6 overflow-auto border-x">
        <h2 className="text-lg font-semibold p-4 border-b bg-white">Asset Types</h2>
        <ul className="p-2 space-y-2">
          {assetTypes.map((type) => (
            <li
              key={type.assetTypeId}
              className={`px-3 py-1 rounded flex items-center gap-3 cursor-pointer transition ${
                selectedAssetTypeId === type.assetTypeId
                  ? 'bg-gray-100 shadow'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedAssetTypeId(type.assetTypeId)}
            >
              <div>
                <p className="text-md">{type.assetTypeDesc}</p>
                <p className="text-xs text-gray-500">{type.assets.length} Assets</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Asset List Pane */}
      <div className="w-2/6 bg-white overflow-auto">
        <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">Assets</h2>
        <ul className="p-4 space-y-2">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <li
                key={asset.assetNo}
                className="p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-100"
              >
                <div className="bg-gray-200 text-gray-700 flex items-center justify-center w-10 h-10 rounded-full">
                  💻
                </div>
                <div>
                  <p className="text-md">{asset.assetName}</p>
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

      {/* Asset Details Pane */}
      <div className="w-3/6 bg-gray-50 overflow-auto">
        <h2 className="text-lg font-semibold p-4 border-b bg-white">Asset Details</h2>
        {filteredAssets.length > 0 ? (
          <div className="p-4 space-y-4">
            <p>Select an asset to view details.</p>
          </div>
        ) : (
          <p className="p-4 text-gray-500">No details available</p>
        )}
      </div>
    </div>
  );
};

export default Assets;
