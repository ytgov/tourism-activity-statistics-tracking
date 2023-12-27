export * from "./email-service";
export * from "./directory-service";
export * from "./generic-service";
export * from "./kiosk-data-service";
export * from "./user-service";
export * from "./permission-service";
export * from "./reminder-service";
export * from "./visitor-centre-service";
export * from "./loader-service";

export interface QueryStatement {
  field: string;
  fields: [];
  operator: string;
  value: any;
}

export interface SortStatement {
  field: string;
  direction: SortDirection;
}

export enum SortDirection {
  ASCENDING = "asc",
  DESCENDING = "desc",
}
