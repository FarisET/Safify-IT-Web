import React from 'react';
import { Modal, Upload, Input, Radio, Button, Space, Typography } from 'antd';
import { FaQuestionCircle } from 'react-icons/fa';
import LocationDropdown from "../../../components/SearchableLocationDropdown";
import AssignToDropdown from "../../../components/SearchableUsersDropdown";

const { Text } = Typography;

const Modals = ({
    modalOpen, AssignmodalOpen, DeletemodalOpen, DisposemodalOpen, DeleteTypeModalOpen,
    AssignLocmodalOpen, UnAssignmodalOpen, UnssignLocmodalOpen, addTypeModalOpen,
    UpdateTypeModalOpen, addAssetModalOpen, bulkUploadModalOpen, editloading, modalMessage, modalErrorMessage, formData, assignToloading, AssignmodalMessage, assignToerror, Deleteloading, DeletemodalMessage, Deleterror, Disposeloading, DisposemodalMessage, Disposerror, DeleteTypeloading, DeleteTypemodalMessage, DeletTypeError, UnassignToloading, UnAssignmodalMessage, UnassignToerror, assignLocloading, AssignLocmodalMessage, assignLocerror, UnassignLocloading, UnassignLocmodalMessage, UnassignLocerror, addTypeloading, addTypesuccessMessage, addTypeerrorMessage, UpdateTypeloading, UpdateTypemodalMessage, UpdateTypeError, addAssetloading, addAssetsuccessMessage, addAsseterrorMessage, uploadLoading, uploadMsg, uploadError, users, assignTo, handleAssignToInputChange, onCloseAssignToModal, handleAssignToSubmit, deleteInput, setDeleteInput, onCloseDeleteModal, handleDeleteSubmit, DisposeInput, setDisposeInput, onCloseDisposeModal, handleDisposeSubmit, deleteTypeInput, setDeleteTypeInput, onCloseDeleteTypeModal, handleDeleteTypeSubmit, setUnAssignModalOpen, handleUnassignSubmit, filteredSublocations, assignLoc, handleAssignLocInputChange, onCloseAssignLocModal, handleAssignLocSubmit, onCloseUnassignLocModal, handleUnssignLocSubmit, handleAddAssetType, assetTypeDesc, setAssetTypeDesc, isMacType, setIsMacType, onCloseAddTypeModal, handleUpdateTypeSubmit, isMacTypeUpdate, setIsMacTypeUpdate, onCloseUpdateTypeModal, handleAddAsset, addAssetName, setAssetName, addAssetDesc, setAssetDesc, addAssetMac, setAssetMac, onCloseAddAssetModal, handleCloseBulkUploadModal, handleBulkUpload, setSelectedFile, handleInputChange, assetTypeObj, setOnEditModalClose, handleSubmit, assetDetails, selectedAssetType }) => {

    return (
        <>
            <Modal
                title="Edit Asset"
                open={modalOpen}
                onCancel={setOnEditModalClose}
                footer={[
                    <Button key="cancel" onClick={setOnEditModalClose} disabled={editloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSubmit}
                        loading={editloading}
                        disabled={editloading}
                    >
                        Save
                    </Button>,
                ]}
                width={520}
            >
                {editloading && <Text type="warning">Loading...</Text>}
                {modalMessage && <Text type="success">{modalMessage}</Text>}
                {modalErrorMessage && <Text type="danger">{modalErrorMessage}</Text>}

                <div className="space-y-4 mt-4">
                    <div>
                        <Text>Asset Name</Text>
                        <Input
                            name="assetName"
                            value={formData.assetName}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Text>Asset Description</Text>
                        <Input
                            name="assetDescription"
                            value={formData.assetDescription}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>

                    {(assetTypeObj?.has_mac !== 'not allowed') && (
                        <div>
                            <Text>Mac Address</Text>
                            <Input
                                name="mac"
                                value={formData.mac}
                                onChange={handleInputChange}
                                className="mt-1"
                            />
                        </div>
                    )}
                </div>
            </Modal>

            <Modal
                title="Assign Asset"
                open={AssignmodalOpen}
                onCancel={onCloseAssignToModal}
                footer={[
                    <Button key="cancel" onClick={onCloseAssignToModal} disabled={assignToloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAssignToSubmit}
                        loading={assignToloading}
                        disabled={assignToloading}
                    >
                        Save
                    </Button>,
                ]}
            >
                {assignToloading && <Text type="warning">Loading...</Text>}
                {AssignmodalMessage && <Text type="success">{AssignmodalMessage}</Text>}
                {assignToerror && <Text type="danger">{assignToerror}</Text>}

                <div className="mt-4">
                    <Text>Assign To:</Text>
                    <AssignToDropdown
                        options={users}
                        selectedValue={assignTo}
                        onChange={(id) => handleAssignToInputChange({ value: id })}
                        className="mt-1"
                    />
                </div>
            </Modal>

            <Modal
                title="Delete Asset"
                open={DeletemodalOpen}
                onCancel={onCloseDeleteModal}
                footer={[
                    <Button key="cancel" onClick={onCloseDeleteModal} disabled={Deleteloading}>
                        No
                    </Button>,
                    deleteInput === "DELETE" && (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleDeleteSubmit}
                            loading={Deleteloading}
                            disabled={Deleteloading}
                        >
                            Yes
                        </Button>
                    ),
                ]}
            >
                <p>Are you sure you want to delete asset: <strong>{assetDetails?.asset_no}</strong></p>
                {Deleteloading && <Text type="warning">Loading...</Text>}
                {DeletemodalMessage && <Text type="success">{DeletemodalMessage}</Text>}
                {Deleterror && <Text type="danger">{Deleterror}</Text>}

                <div className="mt-4">
                    <Text>Type <strong className="text-red-500">DELETE</strong> to confirm:</Text>
                    <Input
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="DELETE"
                        className="mt-1"
                    />
                </div>
            </Modal>

            <Modal
                title="Dispose Asset"
                open={DisposemodalOpen}
                onCancel={onCloseDisposeModal}
                footer={[
                    <Button key="cancel" onClick={onCloseDisposeModal} disabled={Disposeloading}>
                        No
                    </Button>,
                    DisposeInput === "DISPOSE" && (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleDisposeSubmit}
                            loading={Disposeloading}
                            disabled={Disposeloading}
                        >
                            Yes
                        </Button>
                    ),
                ]}
            >
                <p>Are you sure you want to dispose asset: <strong>{assetDetails?.asset_no}</strong></p>
                {Disposeloading && <Text type="warning">Loading...</Text>}
                {DisposemodalMessage && <Text type="success">{DisposemodalMessage}</Text>}
                {Disposerror && <Text type="danger">{Disposerror}</Text>}

                <div className="mt-4">
                    <Text>Type <strong className="text-red-500">DISPOSE</strong> to confirm:</Text>
                    <Input
                        value={DisposeInput}
                        onChange={(e) => setDisposeInput(e.target.value)}
                        placeholder="DISPOSE"
                        className="mt-1"
                    />
                </div>
            </Modal>

            <Modal
                title="Delete Asset Type"
                open={DeleteTypeModalOpen}
                onCancel={onCloseDeleteTypeModal}
                footer={[
                    <Button key="cancel" onClick={onCloseDeleteTypeModal} disabled={DeleteTypeloading}>
                        No
                    </Button>,
                    deleteTypeInput === "DELETE" && (
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleDeleteTypeSubmit}
                            loading={DeleteTypeloading}
                            disabled={DeleteTypeloading}
                        >
                            Yes
                        </Button>
                    ),
                ]}
            >
                <p>Are you sure you want to delete asset type: <strong>{selectedAssetType}</strong></p>
                {DeleteTypeloading && <Text type="warning">Loading...</Text>}
                {DeleteTypemodalMessage && <Text type="success">{DeleteTypemodalMessage}</Text>}
                {DeletTypeError && <Text type="danger">{DeletTypeError}</Text>}

                <div className="mt-4">
                    <Text>Type <strong className="text-red-500">DELETE</strong> to confirm:</Text>
                    <Input
                        value={deleteTypeInput}
                        onChange={(e) => setDeleteTypeInput(e.target.value)}
                        placeholder="DELETE"
                        className="mt-1"
                    />
                </div>
            </Modal>

            <Modal
                title="Unassign Asset"
                open={UnAssignmodalOpen}
                onCancel={() => setUnAssignModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setUnAssignModalOpen(false)} disabled={UnassignToloading}>
                        No
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUnassignSubmit}
                        loading={UnassignToloading}
                        disabled={UnassignToloading}
                    >
                        Yes
                    </Button>,
                ]}
            >
                <p>Are you sure you want to unassign this asset?</p>
                {UnassignToloading && <Text type="warning">Loading...</Text>}
                {UnAssignmodalMessage && <Text type="success">{UnAssignmodalMessage}</Text>}
                {UnassignToerror && <Text type="danger">{UnassignToerror}</Text>}
            </Modal>

            <Modal
                title="Assign Location"
                open={AssignLocmodalOpen}
                onCancel={onCloseAssignLocModal}
                footer={[
                    <Button key="cancel" onClick={onCloseAssignLocModal} disabled={assignLocloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAssignLocSubmit}
                        loading={assignLocloading}
                        disabled={assignLocloading}
                    >
                        Save
                    </Button>,
                ]}
            >
                {assignLocloading && <Text type="warning">Loading...</Text>}
                {AssignLocmodalMessage && <Text type="success">{AssignLocmodalMessage}</Text>}
                {assignLocerror && <Text type="danger">{assignLocerror}</Text>}

                <div className="mt-4">
                    <Text>Assign To:</Text>
                    <LocationDropdown
                        options={filteredSublocations}
                        selectedValue={assignLoc}
                        onChange={(id) => handleAssignLocInputChange({ value: id })}
                        className="mt-1"
                    />
                </div>
            </Modal>

            <Modal
                title="Unassign Location"
                open={UnssignLocmodalOpen}
                onCancel={onCloseUnassignLocModal}
                footer={[
                    <Button key="cancel" onClick={onCloseUnassignLocModal} disabled={UnassignLocloading}>
                        No
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUnssignLocSubmit}
                        loading={UnassignLocloading}
                        disabled={UnassignLocloading}
                    >
                        Yes
                    </Button>,
                ]}
            >
                <p>Are you sure you want to unassign this asset?</p>
                {UnassignLocloading && <Text type="warning">Loading...</Text>}
                {UnassignLocmodalMessage && <Text type="success">{UnassignLocmodalMessage}</Text>}
                {UnassignLocerror && <Text type="danger">{UnassignLocerror}</Text>}
            </Modal>

            <Modal
                title="Add Asset Type"
                open={addTypeModalOpen}
                onCancel={onCloseAddTypeModal}
                footer={[
                    <Button key="cancel" onClick={onCloseAddTypeModal} disabled={addTypeloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddAssetType}
                        loading={addTypeloading}
                        disabled={addTypeloading}
                    >
                        Save
                    </Button>,
                ]}
            >
                {addTypeloading && <Text type="warning">Loading...</Text>}
                {addTypesuccessMessage && <Text type="success">{addTypesuccessMessage}</Text>}
                {addTypeerrorMessage && <Text type="danger">{addTypeerrorMessage}</Text>}

                <div className="space-y-4 mt-4">
                    <div>
                        <Text>Name</Text>
                        <Input
                            value={assetTypeDesc}
                            onChange={(e) => setAssetTypeDesc(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Text>Network Device?</Text>
                        <p className="text-sm text-gray-500">Will this category of devices have mac addresses?</p>
                        <Radio.Group
                            onChange={(e) => setIsMacType(e.target.value)}
                            value={isMacType}
                            className="mt-1"
                        >
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </Modal>

            <Modal
                title="Update Asset Type"
                open={UpdateTypeModalOpen}
                onCancel={onCloseUpdateTypeModal}
                footer={[
                    <Button key="cancel" onClick={onCloseUpdateTypeModal} disabled={UpdateTypeloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateTypeSubmit}
                        loading={UpdateTypeloading}
                        disabled={UpdateTypeloading}
                    >
                        Save
                    </Button>,
                ]}
            >
                {UpdateTypeloading && <Text type="warning">Loading...</Text>}
                {UpdateTypemodalMessage && <Text type="success">{UpdateTypemodalMessage}</Text>}
                {UpdateTypeError && <Text type="danger">{UpdateTypeError}</Text>}

                <div className="space-y-4 mt-4">
                    <div>
                        <Text>Name:</Text>
                        <Input
                            value={assetTypeDesc}
                            onChange={(e) => setAssetTypeDesc(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Text>Network Device?</Text>
                        <Radio.Group
                            onChange={(e) => setIsMacTypeUpdate(e.target.value)}
                            value={isMacTypeUpdate}
                            className="mt-1"
                        >
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </div>
                </div>
            </Modal>

            <Modal
                title="Add Asset"
                open={addAssetModalOpen}
                onCancel={onCloseAddAssetModal}
                footer={[
                    <Button key="cancel" onClick={onCloseAddAssetModal} disabled={addAssetloading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddAsset}
                        loading={addAssetloading}
                        disabled={addAssetloading}
                    >
                        Save
                    </Button>,
                ]}
            >
                {addAssetloading && <Text type="warning">Loading...</Text>}
                {addAssetsuccessMessage && <Text type="success">{addAssetsuccessMessage}</Text>}
                {addAsseterrorMessage && <Text type="danger">{addAsseterrorMessage}</Text>}

                <div className="space-y-4 mt-4">
                    <div>
                        <Text>Asset Name</Text>
                        <Input
                            value={addAssetName}
                            onChange={(e) => setAssetName(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Text>Asset Description</Text>
                        <Input
                            value={addAssetDesc}
                            onChange={(e) => setAssetDesc(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>

                    {(assetTypeObj?.has_mac !== 'not allowed') && (
                        <div>
                            <Space>
                                <Text>Mac Address</Text>
                                <div className="relative group">
                                    <FaQuestionCircle className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                                    <div className="absolute left-0 mt-1 p-2 bg-gray-800 text-white w-72 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        The MAC address should be of 17 Bits including colons "XX:XX:XX:XX:XX:XX".
                                    </div>
                                </div>
                            </Space>
                            <Input
                                value={addAssetMac}
                                onChange={(e) => {
                                    if (e.target.value.length <= 17) setAssetMac(e.target.value);
                                }}
                                placeholder="XX:XX:XX:XX:XX:XX"
                                className="mt-1"
                            />
                        </div>
                    )}
                </div>
            </Modal>

            <Modal
                title="Bulk Upload Assets"
                open={bulkUploadModalOpen}
                onCancel={handleCloseBulkUploadModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseBulkUploadModal} disabled={uploadLoading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleBulkUpload}
                        loading={uploadLoading}
                        disabled={uploadLoading}
                    >
                        {uploadLoading ? "Uploading..." : "Submit"}
                    </Button>,
                ]}
            >
                <div className="space-y-4">
                    {uploadLoading && <Text type="warning">Loading...</Text>}
                    {uploadMsg && <Text type="success">{uploadMsg}</Text>}
                    {uploadError && <Text type="danger">{uploadError}</Text>}

                    <Text strong>Download the template file and insert your assets.</Text>

                    <Space direction="vertical">
                        <Upload
                            beforeUpload={(file) => {
                                setSelectedFile(file);
                                return false;
                            }}
                            accept=".xlsx"
                        >
                            <Button>Browse File</Button>
                        </Upload>

                        <a href="/files/assets.xlsx" download className="text-blue-600">
                            Download Template
                        </a>
                    </Space>
                </div>
            </Modal>
        </>
    );
};

export default Modals;