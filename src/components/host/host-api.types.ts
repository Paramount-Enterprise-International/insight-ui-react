// host-api.types.ts
export type IBreadcrumbItem = {
  label: string;
  url?: string; // undefined means current / non-clickable
};

export type IHostApi = {
  navigate: (url: string) => void | Promise<void>;
  setTitle: (title: string | null) => void;
  setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};

export type IMenu = {
  menuId: number;
  menuName: string;
  route?: string | null;
  menuTypeId: number;
  parentId: number;
  sequence: number;
  icon?: string | null;
  child?: IMenu[];
  level: number;
  visibility?: string;
  selected?: boolean;
  openInId?: number;
  versionCode?: string;
  applicationCode?: string;
  applicationUrl?: string;
};

export type IUser = {
  employeeCode: string;
  fullName: string;
  userImagePath: string;
};
