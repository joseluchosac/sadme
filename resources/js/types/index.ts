import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: UserAuth;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}
export interface MainNavItem extends NavItem {
  rootUrl: string;
  isOpen?: boolean;
  can: string[] | null;
  subItems?: NavSubItem[] | null;
}

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  can: string[] | null;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserAuth extends User {
  roles?: Role[];
  can: Record<string, boolean>; // devuelto por la session auth de usePage
  [key: string]: unknown; // Permita agregar otras propiedades
}
export interface UserData extends User {
  roles_ids: number[]
}

export interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[]
}

export interface UsersPaginated extends Paginated {
  data: UserItem[];
}
export type MsgType = 'success' | 'error' | 'info' | 'warning';

export type Flash = {
  msg: string;
  type: string;
  action: string;
  data: any;
} | null;

export type LinkPage = {
  url: string | null;
  label: string;
  active: boolean;
  page: number;
}


export interface Paginated {
  links: LinkPage[];
  current_page: number;
  last_page: number;
  from: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface TableColumn {
  label: string;
  key: string;
  show: boolean;
  sortable: boolean;
  className?: string;
}

// OPCION PARA REACT SELECT
export interface OptionSelect {
  value: number | null;
  label: string;
  data?: any;
}


export type Qrystr = {
  search?: string;
  sortby?: string | null;
  page?: string | null;
  per_page?: string | null;
}


// Roles
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
export interface RoleData extends Role {
  permissions_ids: number[]
}
export interface RoleItem extends Role {
  permissions: Permission[]
}
export interface RolesPaginated extends Paginated {
  data: RoleItem[];
}

// Permission
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
export interface PermissionItem extends Permission {
  roles: Role[]
}
export interface PermissionsPaginated extends Paginated {
  data: PermissionItem[];
}

export type CompanySetting = {
  id: number;
  seccion: string;
  ordinal: number;
  campo: string;
  campo_desc: string;
  valor: string;
  created_at: string;
  updated_at: string;
}

// LAB TESTS
export interface Labtest {
  id: number;
  code: string;
  name: string;
  area: string;
  sample: string;
  status: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LabtestItem extends Labtest {
}

export interface LabtestsPaginated extends Paginated {
  data: LabtestItem[];
}

export type LabtestsQrystr = Qrystr & {
}

export interface LabtestData extends Labtest {

}