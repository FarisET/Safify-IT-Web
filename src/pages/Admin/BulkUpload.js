import React, { useState } from 'react';
import { Upload, Table, Button, message } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';


const BulkUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [showFinishButton, setShowFinishButton] = useState(false);

    //
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/files/assets.xlsx'; // Directly point to the file in the public folder
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
        link.download = `assets_${timestamp}.xlsx`;
        link.click();
    };



    // Handle file upload with no checks
    // const handleFileUpload = (file) => {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const binaryStr = e.target.result;
    //         const workbook = XLSX.read(binaryStr, { type: 'binary' });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    //         setData(sheetData);
    //         setShowFinishButton(true);
    //     };
    //     reader.readAsBinaryString(file);
    //     setSelectedFile(file);
    //     return false;
    // };

    //with checks
    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Define required columns
            const requiredColumns = ['asset_no', 'asset_name', 'asset_desc', 'asset_types_desc'];
            const fileColumns = Object.keys(sheetData[0] || {});

            // Check for missing columns
            const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
            if (missingColumns.length > 0) {
                message.error(`The uploaded file is missing required columns: ${missingColumns.join(', ')}`);
                setData([]); // Clear data if invalid
                setSelectedFile(null); // Reset file selection
                setShowFinishButton(false);
                return;
            }

            // Remove extra columns
            const extraColumns = fileColumns.filter(col => !requiredColumns.includes(col));
            if (extraColumns.length > 0) {
                sheetData.forEach(row => {
                    extraColumns.forEach(col => delete row[col]);
                });
                message.warning({
                    content: `Extra columns were removed: ${extraColumns.join(', ')}`,
                    duration: 10,
                });
            }

            // Filter out duplicate asset_no
            const uniqueAssets = [];
            const duplicates = [];
            const seenAssetNos = new Set();

            sheetData.forEach((row) => {
                if (seenAssetNos.has(row.asset_no)) {
                    duplicates.push(row);
                } else {
                    seenAssetNos.add(row.asset_no);
                    uniqueAssets.push(row);
                }
            });

            if (duplicates.length > 0) {
                message.warning({
                    content: `Duplicate rows were removed: ${duplicates.length}`,
                    duration: 5, // Timeout for the message
                });
            }

            setData(uniqueAssets); // Set valid, unique data
            setShowFinishButton(true);
        };
        reader.readAsBinaryString(file);
        setSelectedFile(file);
        return false;
    };


    // Handle Finish button
    const handleBulkUpload = async () => {
        if (!selectedFile || data.length === 0) {
            message.error('Please upload a valid Excel file before finishing.');
            return;
        }

        setUploadLoading(true);
        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                'http://localhost:3001/admin/bulkUpload/uploadAssetSheet',
                { assets: data },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setUploadMsg('Uploaded Successfully');
            setData([]);
            setShowFinishButton(false);
        } catch (error) {
            setUploadError('Failed to upload file. Please try again.');
        } finally {
            setUploadLoading(false);
        }
    };

    const columns = Object.keys(data[0] || {}).map((key) => ({
        title: key,
        dataIndex: key,
        key,
    }));

    // if (loading) return <div className="">
    //     <div className="fixed inset-0 flex items-center justify-center">
    //         <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
    //     </div>

    // </div>;
    // if (error) return <div className="text-center text-red-500 py-8">{error}</div>;


    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4 text-left">Bulk Upload</h2>

            {uploadMsg && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{uploadMsg}</p>}
            {uploadError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{uploadError}</p>}

            <div className="flex-col space-y-4 justify-center text-left">
                <Upload
                    beforeUpload={handleFileUpload}
                    accept=".xlsx"
                    showUploadList={false}
                    className=""
                >
                    <button
                        className="px-6 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
                    >Browse File</button>
                </Upload>

                <button
                    onClick={() => downloadTemplate()}
                    download
                    className="text-sky-600 text-xs  font-medium underline block"
                >
                    Download Template


                </button>
            </div>

            <div className="border-b w-full mt-4 mb-4"></div>

            {data.length > 0 ? (
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record, index) => index}
                    className="mb-4"
                />
            ) :
                <div className="text-center text-gray-500 py-8">Please Upload a file</div>
        }

            {showFinishButton && (
                <button
                    className='px-6 py-1 bg-emerald-100 text-md text-gray-700 font-semibold rounded hover:bg-gray-200 transition'
                    type="primary"
                    loading={uploadLoading}
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
