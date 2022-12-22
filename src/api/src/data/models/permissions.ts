export interface Permissions {
  [key: string]: any;
  email: string;
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}

export interface PermissionsInternal {
  [key: string]: any;
  email: string;
  create: string;
  read: string;
  update: string;
  delete: string;
}
