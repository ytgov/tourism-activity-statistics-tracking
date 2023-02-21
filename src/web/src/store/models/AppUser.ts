export interface AppUser {
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_admin: Boolean;

  scopes: string[];
}
