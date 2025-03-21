import { FaEdit, FaRecycle, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const AssetDetailsPanel = ({
    initLoading,
    displayedAssets,
    searchTerm,
    setSearchTerm,
    selectedAsset,
    handleAssetClick,
    setaddAssetModalOpen,
    navigate,
    assetDetails,
    loading,
    error,
    handleEditClick,
    handleDisposeClick,
    handleDeleteClick,
    handleAssignClick,
    handleUnAssignClick,
    handleAssignToLocClick,
    handleUnassignToLocClick,
    activeTab,
    setActiveTab,
    ticketHistory,
    AssetHistory
  }) => {
    return (
      <>
        <div className="h-screen border-x border-gray-200 bg-white overflow-auto">
          <div className="flex justify-between items-center gap-1 flex-wrap p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Assets</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="whitespace-nowrap px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                onClick={() => navigate('/bulk-upload-assets')}
              >
                Bulk Upload
              </button>
              <button
                type="button"
                className="whitespace-nowrap px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                onClick={() => setaddAssetModalOpen(true)}
              >
                Add +
              </button>
            </div>
          </div>
  
          <div className="p-4">
            <input
              type="text"
              placeholder="🔍 Search assets..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          {!initLoading ? (
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
                    className={`p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-100 ${selectedAsset?.assetNo === asset.assetNo ? "bg-gray-100" : ""}`}
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
          ) : (
            <div className="inset-0 mt-[40vh] flex items-center justify-center">
              <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          )}
        </div>
  
        <div className="h-screen border-l border-gray-200 bg-white overflow-auto flex flex-col">
          <span className='bg-gray-50 flex justify-between items-left p-4 border-b'>
            <h2 className="text-lg font-semibold bg-white">Asset Details</h2>
            <div className="flex space-x-4">
              {assetDetails ? (
                <>
                  <button
                    onClick={() => handleEditClick(assetDetails)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                  >
                    <span>Edit</span>
                    <FaEdit className="text-sm" />
                  </button>
  
                  {assetDetails.asset_status === 'available' && (
                    <button
                      onClick={() => handleDisposeClick(assetDetails.asset_no)}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                    >
                      <span>Dispose</span>
                      <FaRecycle className="text-sm" />
                    </button>
                  )}
  
                  <button
                    onClick={() => handleDeleteClick(assetDetails.asset_no)}
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
            <div className="fixed inset-0 left-[45vw] flex items-center justify-center">
              <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          ) : error ? (
            <p className="p-4 text-red-500">{error}</p>
          ) : assetDetails ? (
            <div className="h-screen p-6 bg-white space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <strong className="text-gray-600 font-semibold text-sm">Asset Number</strong>
                <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_no}</span>
  
                <strong className="text-gray-600 font-semibold text-sm">Asset Name</strong>
                <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_name}</span>
  
                <strong className="text-gray-600 font-semibold text-sm">Description</strong>
                <span className="text-gray-800 text-sm font-medium">{assetDetails.asset_desc}</span>
  
                <strong className="text-gray-600 font-semibold text-sm">MAC Address</strong>
                <span className="text-gray-800 text-sm font-medium">{assetDetails.mac}</span>
  
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
  
                <strong className="text-gray-600 font-semibold text-sm">Creation Date</strong>
                <span className="text-gray-800 text-sm font-medium">
                  {format(assetDetails.asset_creation_date, "MMM dd, yyyy")}
                </span>
  
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
                      className="ml-2 px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-red-200 transition"
                      onClick={() => handleUnAssignClick(assetDetails.assigned_to)}
                    >
                      Unassign
                    </button>
                  )}
                </span>
  
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
                      className="ml-2 px-2 py-1 bg-gray-100 font-semibold text-gray-700 text-xs rounded hover:bg-red-200 transition"
                      onClick={() => handleUnassignToLocClick(assetDetails.asset_location_id)}
                    >
                      Unassign
                    </button>
                  )}
                </div>
  
                <strong className="text-gray-600 font-semibold text-sm">Is Active</strong>
                <span className="text-gray-800 text-sm font-medium">
                  {assetDetails.is_active ? "Yes" : "No"}
                </span>
              </div>
  
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
  
                <div className="mt-4">
                  {activeTab === "Asset History" && (
                    <div>
                      <div className="overflow-auto max-h-64 border rounded-lg">
                        <table className="w-full text-left">
                          <thead className="sticky top-0 bg-gray-100">
                            <tr>
                              <th className="p-3 text-sm text-gray-600">ID</th>
                              <th className="p-3 text-sm text-gray-600">Action</th>
                              <th className="p-3 text-sm text-gray-600">Status</th>
                              <th className="p-3 text-sm text-gray-600">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketHistory.map((ticket) => (
                              <tr key={ticket.asset_log_id} className="hover:bg-gray-50">
                                <td className="p-3 text-sm">{ticket.asset_log_id}</td>
                                <td className="p-3 text-sm">{ticket.action_performed}</td>
                                <td className="p-3 text-sm">{ticket.action_status}</td>
                                <td className="p-3 text-sm">
                                  {format(ticket.action_datetime, "MMM dd, yyyy HH:mm:ss")}
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
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 text-gray-500 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Asset Icon"
                >
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm1 2a1 1 0 000 2h8a1 1 0 000-2H6zm0 4a1 1 0 000 2h4a1 1 0 000-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-md font-semibold text-gray-700">Select an asset to view details.</p>
            </div>
          )}
        </div>
      </>
    );
  };

export default AssetDetailsPanel;