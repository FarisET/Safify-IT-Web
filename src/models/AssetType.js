import { Asset } from './Asset';

export class AssetType {
  constructor(assetTypeId, assetTypeDesc,has_mac, assets) {
    this.assetTypeId = assetTypeId;
    this.assetTypeDesc = assetTypeDesc;
    this.has_mac = has_mac;
    this.assets = assets.map(asset => Asset.fromJson(asset));
  }

  static fromJson(json) {
    return new AssetType(json.asset_type_id, json.asset_type_desc, json.has_mac, json.assets);
  }
}