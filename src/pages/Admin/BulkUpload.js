import React, { useState } from 'react';
import { Upload, Table, Input, Button, message } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaQuestionCircle } from 'react-icons/fa';

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
    const [uploadSummary, setUploadSummary] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');


    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/files/assets.xlsx'; // Directly point to the file in the public folder
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
        link.download = `assets_${timestamp}.xlsx`;
        link.click();
    };

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const requiredColumns = ['asset_no', 'asset_name', 'asset_desc', 'asset_types_desc'];
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

    const generateUploadSummary = (rowsInserted, duplicateCount, invalidTypeCount) => {
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
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                'http://localhost:3001/admin/bulkUpload/uploadAssetJson',
                { jsonAssetData: data },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );



            const { rows_inserted, duplicate_assets, invalid_asset_types } = response.data.status;

            if (duplicate_assets.length > 0 || invalid_asset_types.length > 0) {
                const duplicateCount = duplicate_assets.length;
                const invalidTypeCount = invalid_asset_types.length;

                setDuplicateAssets(duplicate_assets.map(item => item.asset_no));
                setInvalidAssetTypes(invalid_asset_types.map(item => item.asset_no));

                generateUploadSummary(rows_inserted, duplicateCount, invalidTypeCount);


            } else {
                setUploadMsg(`Uploaded Successfully, rows inserted: ${rows_inserted}`);
                setData([]);
                setUploadSummary(null);
                setShowFinishButton(false);
            }

        } catch (error) {
            setUploadError(`Failed to upload file. ${error.message}`);
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
            render: (text) => (
                <span style={{ color: duplicateAssets.includes(text) ? 'red' : 'inherit' }}>
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
            dataIndex: 'asset_types_desc',
            key: 'asset_types_desc',
            render: (text, record) => (
                <span style={{ color: invalidAssetTypes.includes(record.asset_no) ? 'red' : 'inherit' }}>
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
            {/* <div className="flex items-top space-x-2 relative">
                <h4 className="text-2xl font-semibold mb-4 text-left">Bulk Upload</h4>

                <div className="relative group">
                    <FaQuestionCircle className="text-gray-700 text-md hover:text-sky-500 cursor-pointer" />
                    <div className="p-2 bg-gray-800 text-white w-96 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Download the excel template and fill in the fields according to the format. All fields are compulsory. Place a '-' where applicable
                    </div>
                </div>
            </div> */}
            <h4 className="text-2xl font-semibold mb-4 text-left">Bulk Upload</h4>


            {uploadMsg && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{uploadMsg}</p>}
            {uploadError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{uploadError}</p>}
            {uploadSummary && <p className="mb-4 p-3 rounded text-gray-700 bg-amber-100">{uploadSummary}</p>}

            <div className="flex-col space-y-4 justify-center text-left">
                <Upload
                    beforeUpload={handleFileUpload}
                    accept=".xlsx"
                    showUploadList={false}
                >
                    <button className="px-6 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition">
                        Browse File
                    </button>
                </Upload>

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
