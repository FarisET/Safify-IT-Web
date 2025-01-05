class ActionReport {
    constructor(data) {
      this.actionTeamName = data['action_team_name'];
      this.userReportId = data['user_report_id'];
      this.actionReportId = data['action_report_id'];
      this.reportDescription = data['report_description'];
      this.questionOne = data['question_one'];
      this.questionTwo = data['question_two'];
      this.questionThree = data['question_three'];
      this.questionFour = data['question_four'];
      this.questionFive = data['question_five'];
      this.resolutionDescription = data['resolution_description'];
      this.reportedBy = data['reported_by'];
      this.surroundingImage = data['surrounding_image'];
      this.proofImage = data['proof_image'];
      this.dateTime = data['atr.date_time'];
      this.status = data['status'];
      this.incidentSubtypeDescription = data['incident_subtype_description'];
      this.assetName = data['asset_name'];
      this.assetNo = data['asset_no'];
    }
  
    // Optional: Add methods for data formatting or utility
    getFormattedDateTime() {
      return new Date(this.dateTime).toLocaleString(); // Formats date for readability
    }
  }
  
  export default ActionReport;
  