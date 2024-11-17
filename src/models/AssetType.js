import { Asset } from './Asset';

export class AssetType {
  constructor(assetTypeId, assetTypeDesc, assets) {
    this.assetTypeId = assetTypeId;
    this.assetTypeDesc = assetTypeDesc;
    this.assets = assets.map(asset => Asset.fromJson(asset));
  }

  static fromJson(json) {
    return new AssetType(json.asset_type_id, json.asset_type_desc, json.assets);
  }
}