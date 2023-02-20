export interface User {
  email: string;
  sub: string;
  first_name: string;
  last_name: string;
  status: string;
  ynet_id: string;
  directory_id: string;
  is_admin: Boolean;
  create_date: Date;

  department_admin_for?: string[];
  roles?: string | string[];
  scopes?: string[];
  display_name?: string;
}
