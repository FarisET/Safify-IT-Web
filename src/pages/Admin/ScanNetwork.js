import React, { useState } from 'react';
import { Modal,Table, Input, Button, message } from 'antd';
import axios from 'axios';
import { useScan } from '../../state/context/scanContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ScanNetwork = () => {
    const [ipRange, setIpRange] = useState('');
    const [loading, setLoading] = useState(false);
    const { scanState, setScanState } = useScan();
    const [paginationConfig, setPaginationConfig] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedPorts, setSelectedPorts] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);





    const handleRunScan = async () => {
        if (!ipRange) {
            message.error('Please enter an IP range.');
            return;
        }

        setScanState((prev) => ({ ...prev, isLoading: true }));
        try {
            const jwtToken = sessionStorage.getItem('jwt');
            const response = await axios.post(
                'http://localhost:3001/network/runScan',
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
        } catch (error) {
            setScanState({ isLoading: false, data: [] });
            message.error('Error running scan.');
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
                    <Button type="link" onClick={() => handleViewPorts(record.ports)}>
                        View Ports
                    </Button>
                ) : (
                    'N/A'
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
                <Button type="primary" onClick={handleRunScan} loading={scanState.isLoading}>
                    Run Scan
                </Button>
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
        </div>
    );
};

export default ScanNetwork;
