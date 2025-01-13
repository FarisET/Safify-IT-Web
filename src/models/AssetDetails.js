export class AssetDetails {
    constructor(
        assetNo,
        assetName,
        assetDesc,
        assetType,
        assetTypeId,
        assetCreationDate,
        status,
        assetIssueCount,
        isActive,
        assignedTo,
        userName,
        assetLocation,
        locationName,
        assetSubLocationId,
        mac
    ) {
        this.assetNo = assetNo;
        this.assetName = assetName;
        this.assetDesc = assetDesc;
        this.assetType = assetType;
        this.assetTypeId = assetTypeId;
        this.assetCreationDate = assetCreationDate;
        this.status = status;
        this.assetIssueCount = assetIssueCount;
        this.isActive = isActive;
        this.assignedTo = assignedTo;
        this.userName = userName;
        this.assetLocation = assetLocation;
        this.locationName = locationName;
        this.assetSubLocationId = assetSubLocationId;
        this.mac = mac;
    }

    static fromJson(json) {
        return new AssetDetails(
            json.asset_no || '',
            json.asset_name || '',
            json.asset_desc || '',
            json.asset_type || '',
            json.asset_type_id || null,
            json.asset_creation_date ? new Date(json.asset_creation_date) : null,
            json.asset_status || '',
            json.asset_issue_count || 0,
            json.is_active || '',
            json.assigned_to || '',
            json.user_name || '',
            json.asset_location || '',
            json.location_name || '',
            json.asset_location_id || '',
            json.mac || ''
        );
    }

    toJson() {
        return {
            asset_no: this.assetNo,
            asset_name: this.assetName,
            asset_desc: this.assetDesc,
            asset_type: this.assetType,
            asset_type_id: this.assetTypeId,
            asset_creation_date: this.assetCreationDate ? this.assetCreationDate.toISOString() : null,
            asset_status: this.status,
            asset_issue_count: this.assetIssueCount,
            is_active: this.isActive,
            assigned_to: this.assignedTo,
            user_name: this.userName,
            asset_location: this.assetLocation,
            location_name: this.locationName,
            asset_location_id: this.assetSubLocationId,
            mac: this.mac
        };
    }
}
