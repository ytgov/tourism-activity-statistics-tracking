export interface User {
  email: string;
  sub: string;
  first_name: string;
  last_name: string;
  status: string;
  ynet_id: string;
  directory_id: string;
  create_date: Date;

  roles?: string | string[];
  scopes?: string[];
  department_admin_for?: string | string[];
  display_name?: string;
}
