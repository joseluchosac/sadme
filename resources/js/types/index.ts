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

// units
export interface Unit {
  id: number,
  code: string;
  abb: string;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

// product_types
export interface ProductType {
  id: number,
  code: string;
  name: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

// affectation_types
export interface AffectationType {
  id: number,
  code: string;
  name: string;
  tax_letter: string;
  tax_code: string;
  tax_name: string;
  tax_type: string;
  tax_percentage: number;
  importe_icbper: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

// products
export interface Product {
  id: number;
  code: string;
  name: string;
  unit_code: string;
  price: number;
  min_stock: number;
  brand: string;
  barcode: string;
  product_type_id: number;
  affectation_type_id: number;
  description: string;
  details?: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}
export interface ProductData extends Product {

}
export interface ProductItem extends Product {
  product_type_name: string;
  affectation_type_name: string;
}
export interface ProductsPaginated extends Paginated {
  data: ProductItem[];
}
export type ProductsQrystr = Qrystr & {
  product_type_id: number | null;
  status: string | null;
}