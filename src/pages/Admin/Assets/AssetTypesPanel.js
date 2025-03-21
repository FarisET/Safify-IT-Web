import { FaEllipsisV } from 'react-icons/fa';
import { Select } from 'antd';
const { Option } = Select;

const AssetTypesPanel = ({
    filterType,
    setFilterType,
    initLoading,
    assetTypes,
    selectedAssetTypeId,
    setSelectedAssetTypeId,
    setAssetTypeObj,
    setaddTypeModalOpen,
    activeOptionsId,
    toggleOptions,
    handleUpdateTypeClick,
    handleDeleteTypeClick,
    setActiveOptionsId
  }) => {
    return (
      <div className="border-r border-gray-200 overflow-auto border-x bg-white">
        <div className="flex justify-between gap-1 flex-wrap items-center p-4 border-b bg-white">
          <h2 className="text-lg font-semibold whitespace-nowrap">Asset Types</h2>
          <button
            type="button"
            className="whitespace-nowrap px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
            onClick={() => setaddTypeModalOpen(true)}
          >
            Add +
          </button>
        </div>
  
        {/* Filter Options */}
        <div className="p-4 flex items-center gap-4 border-b bg-white">
          <Select
            id="filterType"
            value={filterType}
            onChange={(value) => setFilterType(value)}
            className="w-full"
            placeholder='Select Filter'
          >
            <Option value="all">All</Option>
            <Option value="network">Network</Option>
            <Option value="non-network">Non-Network</Option>
          </Select>
        </div>
  
        {!initLoading ? (
          <ul
            className="p-4 space-y-2 overflow-y-auto"
            style={{
              maxHeight: '80vh',
            }}
          >
            {assetTypes
              .filter((type) => {
                if (filterType === 'network') return type.has_mac == 'allowed';
                if (filterType === 'non-network') return type.has_mac == 'not allowed';
                return true;
              })
              .map((type) => (
                <li
                  key={type.assetTypeId}
                  className={`px-3 py-1 rounded flex items-center justify-between gap-2 cursor-pointer transition ${selectedAssetTypeId === type.assetTypeId ? 'bg-gray-100 shadow' : 'bg-white hover:bg-gray-100'}`}
                  onClick={() => {
                    setSelectedAssetTypeId(type.assetTypeId);
                    setAssetTypeObj(type);
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {type.assetTypeDesc}
                      <span className="text-sm text-gray-500">
                        {' '}
                        ({type.assets.filter((asset) => asset.assetNo != null).length})
                      </span>
                    </p>
                  </div>
  
                  {selectedAssetTypeId === type.assetTypeId && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOptions(type.assetTypeId);
                        }}
                        className="p-1 transition text-sm text-gray-700"
                      >
                        <FaEllipsisV />
                      </button>
  
                      {activeOptionsId === type.assetTypeId && (
                        <div className="absolute right-0 mt-2 w-20 bg-white shadow-md border rounded-md z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateTypeClick(type.assetTypeId);
                              setActiveOptionsId(null);
                            }}
                            className="block w-full text-center p-1 font-semibold text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Update
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTypeClick(type.assetTypeId, type.assetTypeDesc);
                              setActiveOptionsId(null);
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
        ) : (
          <div className="inset-0 mt-[40vh] flex items-center justify-center">
            <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-6 h-6 animate-spin"></div>
          </div>
        )}
      </div>
    );
  };

export default AssetTypesPanel;