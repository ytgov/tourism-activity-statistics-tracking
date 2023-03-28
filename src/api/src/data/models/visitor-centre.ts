export interface VisitorCentre {
  id: string;
  name: string;
  community: string;
  region: string;
  is_active: Boolean;
  reminders_at: string[] | string;
  reminders_when: string;

  origins?: any[];
}

export interface VisitorCentreSeason {
  id: number;
  visitor_centre_id: number;
  year: string;
  open_date: Date;
  close_date: Date;
  projected_visitors: number;
  notes: string;
}
