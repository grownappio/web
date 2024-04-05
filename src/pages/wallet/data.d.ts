export type TypeAssetItem = {
  address: string;
  balance: string;
  icon: string;
  id: number;
  name: string;
  symbol: string;
  fee_amount?: string;
  fee_token_id?: number;
  min_transfer_amount?: string;
}