export class Asset {
    constructor(assetNo, assetName, assetIssueCount) {
      this.assetNo = assetNo;
      this.assetName = assetName;
      this.assetIssueCount = assetIssueCount;
    }
  
    static fromJson(json) {
      return new Asset(json.asset_no, json.asset_name, json.asset_issue_count);
    }
  }
  