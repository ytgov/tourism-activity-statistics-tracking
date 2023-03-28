export interface AppUser {
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_admin: Boolean;

  primary_site?: number;
  scopes: string[] | UserScope[];

  inputSites?: number[];
  manageSites?: number[];
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
