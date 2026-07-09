export const ROLES = [
  "customer",
  "sales_executive",
  "sales_manager",
  "installation_engineer",
  "service_engineer",
  "admin",
  "super_admin"
] as const;

export type UserRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  sales_executive: "Sales Executive",
  sales_manager: "Sales Manager",
  installation_engineer: "Installation Engineer",
  service_engineer: "Service Engineer",
  admin: "Admin",
  super_admin: "Super Admin"
};

export function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function hasAnyRole(role: UserRole | undefined, allowed: readonly UserRole[]) {
  return Boolean(role && allowed.includes(role));
}

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];
export const CONTROL_ROLES: UserRole[] = ["sales_executive", "sales_manager", "admin", "super_admin"];
export const CUSTOMER_ROLES: UserRole[] = ["customer", "sales_executive", "sales_manager", "admin", "super_admin"];
