export interface KioskData {
  id?: string;
  kiosk_name: string;
  start_date: Date;
  end_date: Date;
  playout_item: string;
  playout_count?: number;
  playout_seconds?: number;
}
