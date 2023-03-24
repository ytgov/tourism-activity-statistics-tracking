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
  primary_site?: number;

  department_admin_for?: string[];
  roles?: string | string[];
  scopes?: string[] | UserScope[];
  display_name?: string;
}

export interface UserScope {
  id: number;
  email: string;
  name: string;
  operation: string;
  relevant_entity: string;
  relevant_id: number;
  relevant_entity_type: string;
  create_date: Date;
}
