import React, { useState } from 'react';
import { Table, Select, Input, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ScanNetwork = () => {
    const [ipRange, setIpRange] = useState('');
    const [timeout, setTimeout] = useState('30');
    const [scanData, setScanData] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateIpRange = (ip) => {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipRegex.test(ip);
    };

    const handleRunScan = async () => {
        if (!validateIpRange(ipRange)) {
            message.error('Invalid IP range format. Please use a format like 192.168.0.0');
            return;
        }

        setLoading(true);
        try {
            const jwtToken = sessionStorage.getItem('jwt');

            const response = await axios.post('http://localhost:3001/network/runScan',
                {
                    iprange: ipRange,
                    timeout: timeout,
                },
                {

                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },

                });
            setScanData(response.data);
            message.success('Scan completed successfully');
        } catch (error) {
            message.error('Error running scan. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
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
        <div style={{ padding: '20px' }}>
            <h2>Run Network Scan</h2>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Input
                    placeholder="Enter IP range (e.g., 192.168.0.0)"
                    value={ipRange}
                    onChange={(e) => setIpRange(e.target.value)}
                    style={{ width: '300px' }}
                />
                <Select value={timeout} onChange={(value) => setTimeout(value)} style={{ width: '150px' }}>
                    <Option value="30">30 seconds</Option>
                    <Option value="60">60 seconds</Option>
                    <Option value="90">90 seconds</Option>
                    <Option value="120">120 seconds</Option>
                </Select>
                <Button type="primary" onClick={handleRunScan} loading={loading}>
                    Run Scan
                </Button>
            </div>
            <Table
                dataSource={scanData}
                columns={columns}
                rowKey="ip"
                bordered
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ScanNetwork;