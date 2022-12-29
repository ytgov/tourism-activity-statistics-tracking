export interface PermissionsString {
  [key: string]: any;
  email: string;
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
}

export interface PermissionsArray {
  [key: string]: any;
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}
