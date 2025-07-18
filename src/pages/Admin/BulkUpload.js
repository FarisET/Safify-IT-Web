import React, { useState, useEffect } from 'react';
import { Modal, Upload, Table, Input, Button, message } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaQuestionCircle } from 'react-icons/fa';
import constants from '../../const';
const BulkUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [showFinishButton, setShowFinishButton] = useState(false);
    const [showRedItemsOnly, setShowRedItemsOnly] = useState(false);
    const [duplicateAssets, setDuplicateAssets] = useState([]);
    const [invalidAssetTypes, setInvalidAssetTypes] = useState([]);
    const [duplicateMacAddresses, setDuplicateMacAddresses] = useState([]);
    const [macNotAllowed, setMacNotAllowed] = useState([]);

    
    
    const [invalidMacs, setInvalidMacs] = useState([]);
    const [uploadSummary, setUploadSummary] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //       event.preventDefault();
    //       event.returnValue = ""; // Required for modern browsers to display a warning
    //     };
    
    //     // Attach the event listener
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    
    //     // Cleanup on component unmount
    //     return () => {
    //       window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    //   }, []);


    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/files/bulk upload assets template.xlsx'; // Directly point to the file in the public folder
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
        link.download = `assets_${timestamp}.xlsx`;
        link.click();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }


        const validExtensions = ['xlsx'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const mimeType = file.type;

        if (!validExtensions.includes(fileExtension) || mimeType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            message.error('Invalid file type. Please upload an Excel file (.xlsx).');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const requiredColumns = ['asset_no', 'asset_name', 'asset_desc', 'asset_type_desc'];
            const fileColumns = Object.keys(sheetData[0] || {});
            const missingColumns = requiredColumns.filter((col) => !fileColumns.includes(col));

            if (missingColumns.length > 0) {
                message.error(`The uploaded file is missing required columns: ${missingColumns.join(', ')}`);
                setData([]);
                setSelectedFile(null);
                setShowFinishButton(false);
                return;
            }

            // Check for duplicate asset_no within the sheet
            const assetNoCount = {};
            const updatedSheetData = sheetData.map((row) => {
                const assetNo = row.asset_no;
                if (assetNo) {
                    assetNoCount[assetNo] = (assetNoCount[assetNo] || 0) + 1;
                }
                return row;
            });

            const sheetDuplicates = Object.keys(assetNoCount).filter((key) => assetNoCount[key] > 1);

            // Flag duplicates within the sheet
            const flaggedData = sheetData.map((row) => ({
                ...row,
                isDuplicateWithinSheet: sheetDuplicates.includes(row.asset_no),
            }));

            if (sheetDuplicates.length > 0) {

                Modal.error({

                    title: 'Duplicate Assets Found',

                    content: (

                        <div>

                            <p>The following asset numbers are duplicated within the sheet:</p>

                            <ul>

                                {sheetDuplicates.map((duplicate) => (

                                    <li key={duplicate}>{duplicate}</li>

                                ))}
                            </ul>
                        </div>
                    ),
                    okText: 'Close',
                    okButtonProps: {
                        className: 'bg-primary text-white hover:bg-primary-dark',
                    },
                });

            }

            // Validate MAC addresses
            const invalidMacsTemp = [];
            const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

            const validatedData = flaggedData.map((row) => {
                const macAddress = row.mac_address ? String(row.mac_address).trim() : ''; // Ensure mac_address is a string
                const isInvalidMac = macAddress && !macRegex.test(macAddress);
                if (isInvalidMac) {
                    invalidMacsTemp.push(row.asset_no); // Store the asset_no of rows with invalid MACs
                }

                return {
                    ...row,
                    isInvalidMac,
                };
            });

            setInvalidMacs(invalidMacsTemp || []);
            setData(validatedData); // Reconciled data containing both flags and validation results
            setShowFinishButton(true);
        };
        reader.readAsBinaryString(file);
        setSelectedFile(file);
    };





    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const requiredColumns = ['asset_no', 'asset_name', 'asset_desc', 'asset_type_desc'];
            const fileColumns = Object.keys(sheetData[0] || {});
            const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));

            if (missingColumns.length > 0) {
                message.error(`The uploaded file is missing required columns: ${missingColumns.join(', ')}`);
                setData([]);
                setSelectedFile(null);
                setShowFinishButton(false);
                return;
            }

            setData(sheetData);
            setShowFinishButton(true);
        };
        reader.readAsBinaryString(file);
        setSelectedFile(file);
        return false;
    };

    const generateUploadSummary = (rowsInserted, duplicateCount, invalidTypeCount, invalidMacCount, macNotAllowedCount) => {
        setUploadSummary(
            <div>
                <h3 className='mt-2 mb-2 font-semibold text-md'>Upload Summary:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li className='flex align-center space-x-2'>
                        <h4 className='font-semibold text-gray-700'>Rows Inserted:</h4>{' '}
                        <span style={{ color: '#000' }}>{rowsInserted}</span>
                    </li>
                    <li className='flex align-center space-x-2'>
                        <h4 className='font-semibold text-gray-700'>Duplicate Assets:</h4>{' '}
                        <span style={{ color: '#000' }}>{duplicateCount}</span>
                    </li>
                    <li className='flex align-center space-x-2'>
                        <h4 className='font-semibold text-gray-700'>Invalid Asset Types:</h4>{' '}
                        <span className=''>{invalidTypeCount}</span>
                    </li>
                    <li className='flex align-center space-x-2'>
                        <h4 className='font-semibold text-gray-700'>Duplicate Mac addresses:</h4>{' '}
                        <span className=''>{invalidMacCount}</span>
                    </li>
                    <li className='flex align-center space-x-2'>
                        <h4 className='font-semibold text-gray-700'>Non Network Asset Type with Mac Address</h4>{' '}
                        <span className=''>{macNotAllowedCount}</span>
                    </li>
                </ul>
                <p className='mt-2 flex align-center space-x-2'>
                    <h4 className='font-semibold text-gray-700'>Note: </h4> The invalid or duplicate values are highlighted in the table as
                    <span className='font-semibold text-red-500'>red</span>. Please re-upload your
                    Excel file after fixing the highlighted values.
                </p>
            </div>
        );
    };

    const handleBulkUpload = async () => {
        if (!selectedFile || data.length === 0) {
            message.error('Please upload a valid Excel file before finishing.');
            return;
        }

        setUploadLoading(true);
        try {
            const jwtToken = localStorage.getItem('jwt');
            const response = await axios.post(
                `${constants.API.BASE_URL}/admin/bulkUpload/uploadAssetJson`,
                { jsonAssetData: data },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );



            const { rows_inserted, duplicate_assets, invalid_asset_types, duplicate_mac_addresses, mac_not_allowed  } = response.data.status;

            if (duplicate_assets.length > 0 || invalid_asset_types.length > 0 || duplicate_mac_addresses.length > 0 || mac_not_allowed.length > 0) {
                const duplicateCount = duplicate_assets.length;
                const invalidTypeCount = invalid_asset_types.length;
                const invalidMacCount = duplicate_mac_addresses.length;
                const macNotAllowedCount = mac_not_allowed.length;

                setDuplicateAssets(duplicate_assets.map(item => item.asset_no));
                setInvalidAssetTypes(invalid_asset_types.map(item => item.asset_no));
                setDuplicateMacAddresses(duplicate_mac_addresses.map(item => item.asset_no));
                setMacNotAllowed(mac_not_allowed.map(item => item.asset_no));
                setInvalidMacs();
                generateUploadSummary(rows_inserted, duplicateCount, invalidTypeCount, invalidMacCount, macNotAllowedCount);


            } else {
                setUploadMsg(`Uploaded Successfully, rows inserted: ${rows_inserted}`);
                setData([]);
                setUploadSummary(null);
                setShowFinishButton(false);
            }

        } catch (error) {
            setUploadError(`Failed to upload file. ${error.response.data.error}`);
        } finally {
            setUploadLoading(false);
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'rowNumber',
            key: 'rowNumber',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Asset No',
            dataIndex: 'asset_no',
            key: 'asset_no',
            render: (text, record) => (
                <span
                    style={{
                        color:
                            duplicateAssets.includes(text) || record.isDuplicateWithinSheet
                                ? 'red'
                                : 'inherit',
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: 'Asset Name',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Asset Description',
            dataIndex: 'asset_desc',
            key: 'asset_desc',
        },
        {
            title: 'Asset Type Description',
            dataIndex: 'asset_type_desc',
            key: 'asset_type_desc',
            render: (text, record) => (
                <span style={{ color: invalidAssetTypes.includes(record.asset_no) || macNotAllowed.includes(record.asset_no) ? 'red' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Mac Address',
            dataIndex: 'mac_address',
            key: 'mac_address',
            render: (text, record) => (
                <span style={{ color: invalidMacs?.includes(record.asset_no) || duplicateMacAddresses?.includes(record.asset_no)  ? 'red' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
    ];

    const filteredData = data.filter((item) => {
        const matchesSearch = Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (showRedItemsOnly) {
            const isRedItem =
                duplicateAssets.includes(item.asset_no) ||
                invalidAssetTypes.includes(item.asset_no);
            return matchesSearch && isRedItem;
        }
        return matchesSearch;
    });


    return (
        <div className="container mx-auto px-4 py-8">
            <h4 className="text-2xl font-semibold mb-4 text-left">Bulk Upload</h4>

            {uploadMsg && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{uploadMsg}</p>}
            {uploadError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{uploadError}</p>}
            {uploadSummary && <p className="mb-4 p-3 rounded text-gray-700 bg-amber-100">{uploadSummary}</p>}

            <div className="flex-col space-y-4 justify-center text-left">
                {/* <Upload
                    beforeUpload={handleFileUpload}
                    accept=".xlsx"
                    showUploadList={false}
                >
                    <button className="px-6 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition">
                        Browse File
                    </button>
                </Upload> */}
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileInputChange(e)}
                // className="px-6 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
                />


                <button
                    onClick={() => downloadTemplate()}
                    className="text-sky-600 text-xs font-medium underline block"
                >
                    Download Template
                </button>
            </div>

            <div className="border-b w-full mt-4 mb-4"></div>

            {!selectedFile ? (
                <div className="text-gray-500 text-center py-4">
                    Please upload a file to begin.
                </div>
            ) : (
                <div className="mt-4 mb-4 flex items-center space-x-4">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="🔍 Search assets..."
                        className="w-1/3 px-3 py-2 border rounded-lg text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Filter Button */}
                    {(duplicateAssets.length > 0 || invalidAssetTypes.length > 0) && (
                        <button
                            className={`px-4 py-2 text-sm font-semibold text-gray-700 rounded ${showRedItemsOnly ? 'bg-red-100 text-gray-700' : 'bg-gray-100 text-gray-700'
                                } hover:bg-red-100 hover:text-gray-700 transition`}
                            onClick={() => setShowRedItemsOnly((prev) => !prev)}
                        >
                            {showRedItemsOnly ? 'Show All Items' : 'Show Red Items Only'}
                        </button>
                    )}
                </div>
            )}

            {filteredData.length > 0 ? (
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey={(record, index) => index}
                    className="mb-4"
                />
            ) : (
                selectedFile && (
                    <div className="text-center text-gray-500 py-8">No data found</div>
                )
            )}


            {showFinishButton && (
                <button
                    className="px-6 py-1 bg-emerald-100 text-md text-gray-700 font-semibold rounded hover:bg-gray-200 transition"
                    onClick={handleBulkUpload}
                    disabled={uploadLoading}
                >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                </button>
            )}
        </div>
    );
};

export default BulkUpload;