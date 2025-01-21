import React, { useState, useEffect } from 'react';
import { Tooltip, Modal, Table, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { useScan } from '../../state/context/scanContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AssetType } from '../../models/AssetType';
import { useTimer } from "../../state/context/useTimer";
import constants from '../../const';
const ScanNetwork = () => {

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ""; // Required for modern browsers to display a warning
        };

        // Attach the event listener
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const { Option } = Select;
    const [ipRange, setIpRange] = useState('');
    const { scanState, setScanState } = useScan();
    const { timerVisible, setTimerVisible, elapsedTime, setElapsedTime } = useTimer();
    const [paginationConfig, setPaginationConfig] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedPorts, setSelectedPorts] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addAssetData, setAddAssetData] = useState({
        name: '',
        vendor: '',
        mac: '',
        assetTypeId: '',
    });
    const [addAssetLoading, setAddAssetLoading] = useState(false);
    const [isAssetModalVisible, setIsAssetModalVisible] = useState(false);
    const [addedAssets, setAddedAssets] = useState(new Set());
    const [isScanning, setIsScanning] = useState(false);




    const [assetTypes, setAssetTypes] = useState([]);
    const [selectedAssetTypeId, setSelectedAssetTypeId] = useState(null);
    const [selectedAssetType, setSelectedAssetType] = useState(null);
    const [initLoading, setinitLoading] = useState(false);
    const [filterType, setFilterType] = useState('all');




    const fetchAssetTypes = async () => {
        try {
            setinitLoading(true);
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.get(
                `${constants.API.BASE_URL}/admin/dashboard/fetchAssetTypes`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            setAssetTypes(response.data);

        } catch (error) {
            console.error('Error fetching asset types:', error);
        } finally {
            setinitLoading();
        }
    };


    useEffect(() => {
        fetchAssetTypes();
    },
        []);


    const isPrivateNetwork = false; // Example condition, replace with your actual check


    const handleRunScan = async () => {
        if (!ipRange) {
            message.error('Please enter an IP range.');
            return;
        }
        setIsScanning(true);
        setScanState((prev) => ({ ...prev, isLoading: true }));
        try {
            setTimerVisible(true);
            setElapsedTime(0);
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                `${constants.API.BASE_URL}/network/runScan`,
                { iprange: ipRange },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setScanState({ isLoading: false, data: response.data });
            message.success('Scan completed successfully');
            setIsScanning(false);
            setTimerVisible(false);
        } catch (error) {
            setScanState({ isLoading: false, data: [] });
            message.error('Error running scan.');
            setTimerVisible(false);
        }
    };

    const handleExportToExcel = () => {
        if (!scanState.data || scanState.data.length === 0) {
            message.warning('No data available to export.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(scanState.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Scan Results');

        // Auto-width for all columns
        const colWidths = Object.keys(scanState.data[0]).map((key) => ({
            wch: Math.max(
                key.length,
                ...scanState.data.map((row) => (row[key] ? row[key].toString().length : 0))
            ),
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, 'scan_results.xlsx');
        message.success('Exported to Excel.');
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPorts([]);
    };

    const handleClearTable = () => {
        setScanState({ ...scanState, data: [] });
        message.info('Table cleared.');
    };

    const handleViewPorts = (ports) => {
        setSelectedPorts(ports);
        setIsModalVisible(true);
    };

    const handleExportToPDF = () => {
        if (!scanState.data || scanState.data.length === 0) {
            message.warning('No data available to export.');
            return;
        }

        const doc = new jsPDF();
        const tableColumn = [
            '#',
            'IP Address',
            'Name',
            'MAC Address',
            'Vendor',
            'OS',
            'Status',
            'Asset No',
            'Asset Name',
            'Last Scanned',
            'Asset Scan Status',
        ];

        const tableRows = scanState.data.map((row, index) => [
            index + 1,
            row.ip,
            row.name,
            row.mac,
            row.vendor,
            row.os,
            row.status,
            row.asset_no,
            row.asset_name,
            row.last_scanned,
            row.asset_scan_status,
        ]);

        doc.text('Scan Network Results', 14, 16);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('scan_results.pdf');
        message.success('Exported to PDF.');
    };

    const handleFormChange = (key, value) => {
        setAddAssetData((prev) => ({ ...prev, [key]: value }));
    };


    const handleAddAsset = async () => {
        const { name, vendor, mac, assetTypeId } = addAssetData;


        if (!assetTypeId) {
            message.error('Please select an asset type.');
            return;
        }

        setAddAssetLoading(true);

        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                `${constants.API.BASE_URL}/admin/dashboard/addAsset`,
                {
                    asset_name: name,
                    asset_desc: vendor,
                    mac,
                    asset_type_id: assetTypeId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            message.success('Asset added successfully!');
            setAddedAssets((prev) => new Set(prev).add(mac));
            setTimeout(() => {
                handleAssetModalClose()
            }, 2000);

        } catch (error) {
            message.error('Failed to add asset. Please try again.');
        } finally {
            setAddAssetLoading(false);
        }
    };

    const handleAssetModalClose = () => {
        setIsAssetModalVisible(false);
        setAddAssetData({ name: '', vendor: '', mac: '', assetTypeId: '' });

    }

    const handleOpenAddAssetModal = (record) => {
        setAddAssetData({
            name: record.name || '',
            vendor: record.vendor || '',
            mac: record.mac || '',
            assetTypeId: '',
        });
        setIsAssetModalVisible(true);
    };

    const handleStopScan = () => {
        setIsScanning(false);
        setScanState((prev) => ({ ...prev, isLoading: false }));
        message.info('Scan stopped.');
        setTimerVisible(false);
    };


    const columns = [
        {
            title: '#',
            dataIndex: 'rowNumber',
            key: 'rowNumber',
            render: (text, record, index) => {
                const { current, pageSize } = paginationConfig;
                return (current - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'IP Address',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'MAC Address',
            dataIndex: 'mac',
            key: 'mac',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
        },
        {
            title: 'OS',
            dataIndex: 'os',
            key: 'os',
        },
        {
            title: 'Ports',
            key: 'ports',
            render: (text, record) =>
                record.ports && record.ports.length > 0 ? (
                    <div style={{ textAlign: 'center' }}>

                        <Button type="link" onClick={() => handleViewPorts(record.ports)}>
                            View Ports
                        </Button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>

                        N/A
                    </div>
                ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Asset No',
            dataIndex: 'asset_no',
            key: 'asset_no',
        },
        {
            title: 'Asset Name',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Last Scanned',
            dataIndex: 'last_scanned',
            key: 'last_scanned',
        },
        {
            title: 'Asset Scan Status',
            dataIndex: 'asset_scan_status',
            key: 'asset_scan_status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) =>
                record.mac && record.mac !== 'N/A' && record.asset_no == 'N/A' ? (
                    addedAssets.has(record.mac) ? ( // Check if the asset is added
                        <Button type="link" disabled>
                            Added
                        </Button>
                    ) : (
                        <Button type="link" onClick={() => handleOpenAddAssetModal(record)}>
                            Add Asset
                        </Button>
                    )
                ) : (
                    <div style={{ textAlign: 'center' }}>N/A</div>
                ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h4 className="text-2xl font-semibold mb-4 text-left">Scan Network</h4>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Input
                    placeholder="Enter IP range (e.g., 192.168.0.0)"
                    value={ipRange}
                    onChange={(e) => setIpRange(e.target.value)}
                    style={{ width: '300px' }}
                />
                {/* <Tooltip title={!isPrivateNetwork ? "You are not on a private network" : ""}> */}
                    <Button
                        type="primary"
                        className="bg-primary"
                        onClick={() => (isScanning ? handleStopScan() : handleRunScan())}
                        loading={isScanning ? false : scanState.isLoading}
                        // disabled={!isPrivateNetwork} // Disable if not on a private network
                    >
                        {isScanning ? "Stop Scan" : "Run Scan"}
                    </Button>
                {/* </Tooltip> */}

                <div style={{ display: 'flex', gap: '10px' }}>

                    <Button type="default" onClick={handleClearTable}>
                        Clear
                    </Button>
                    <Button type="default" onClick={handleExportToExcel}>
                        Export to Excel
                    </Button>
                </div>
            </div>

            <Table
                dataSource={scanState.data}
                columns={columns}
                rowKey="ip"
                bordered
                loading={scanState.isLoading}
                pagination={{
                    current: paginationConfig.current,
                    pageSize: paginationConfig.pageSize,
                    onChange: (page, pageSize) => {
                        setPaginationConfig({ current: page, pageSize });
                    },
                }}
            />

            <Modal
                title="Port Details"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
            >
                {selectedPorts.length > 0 ? (
                    <Table
                        dataSource={selectedPorts}
                        columns={[
                            { title: 'Port', dataIndex: 'port', key: 'port' },
                            { title: 'Service', dataIndex: 'service', key: 'service' },
                            { title: 'State', dataIndex: 'state', key: 'state' },
                        ]}
                        rowKey="port"
                        pagination={false}
                        bordered
                    />
                ) : (
                    <p>No port details available.</p>
                )}
            </Modal>

            <Modal
                title="Add Asset"
                visible={isAssetModalVisible}
                onCancel={() => setIsAssetModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsAssetModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={addAssetLoading} onClick={handleAddAsset}>
                        Add Asset
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label>
                        Asset Name
                        <Input
                            placeholder="Asset Name"
                            value={addAssetData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                        />
                    </label>
                    <label>
                        Description
                        <Input
                            placeholder="Description"
                            value={addAssetData.vendor}
                            onChange={(e) => handleFormChange('vendor', e.target.value)}
                        />
                    </label>
                    <label>
                        MAC Address
                        <Input
                            placeholder="MAC Address"
                            value={addAssetData.mac}
                            readOnly
                        />
                    </label>

                    <Select
                        placeholder="Select Asset Type"
                        value={addAssetData.assetTypeId}
                        onChange={(value) => handleFormChange('assetTypeId', value)}
                    >
                        {assetTypes.map((type) => (
                            <Select.Option key={type.asset_type_id} value={type.asset_type_id}>
                                {type.asset_type_desc}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>

        </div>
    );
};

export default ScanNetwork;
