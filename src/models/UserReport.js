
class UserReport {
    constructor(data) {
      this.userId = data['user_id'];
      this.userReportId = data['user_report_id'];
      this.reportDescription = data['report_description'];
      this.dateTime = data['date_time'];
      this.subLocationName = data['sub_location_name'];
      this.subLocationID = data['sub_location_id'];
      this.incidentSubtypeDescription = data['incident_subtype_description'];
      this.incidentCriticalityLevel = data['incident_criticality_level'];
      this.incidentCriticalityID = data['incident_criticality_id'];
      this.image = data['image'];
      this.status = data['status'];
      this.assetName = data['asset_name'];
      this.assetNo = data['asset_no'];
      this.Assignee = data['Assignee'];

    }
  
    // Optional: Add any methods you want to format data here, such as date formatting
    getFormattedDateTime() {
      return new Date(this.dateTime).toLocaleString(); // Formats date for readability
    }
  }
  
  export default UserReport;
  