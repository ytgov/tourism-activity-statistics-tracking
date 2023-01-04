export interface User {
  _id?: string;
  email: string;
  sub: string;
  first_name: string;
  last_name: string;
  status?: string;
  roles?: string | string[];
  scopes?: string[];
  department_admin_for?: string | string[];
  display_name?: string;

  create_date?: Date;
}
