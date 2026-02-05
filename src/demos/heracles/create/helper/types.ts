// types.ts
export type PartnerDisposisi = {
  id: string;
  type: string;
  npwp: string;
  skbSkt: {
    id: string;
    name: string;
  };
  skbSktDate: string;
  ktpNib: {
    id: string;
    name: string;
  };
  ktpNibName: string;
  recipientName: string;
  contactName: string;
  telephone: string;
  mobilePhone: string;
  city: string;
  postalCode: string;
  billingAddress: string;
  email: string;
  website: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type DetailItem = {
  itemName: string;
  quantity: number;
  unit: string;
  description: string;
  dpp: number;
  ppn: number;
  subtotal: number;
};

export interface DispositionFormData {
  id: string;
  budgetType?: string;
  document: string;
  schedule: string;
  immediate: boolean;
  deliverySchedule: string;
  realization: boolean;
  title: string;
  needs: string;
  paymentTerms: string;
  department: string;
  pic: string;
  allocation: string;
  taxInvoiceFollows: boolean;
  recipient: string;
  recipientName?: string;
  invoiceNo: string;
  invoiceDate: string;
  skbSkt: string;
  skbSktDate: string;
  type: string;
  name: string;
  telephone: string;
  mobilePhone: string;
  email: string;
  website: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  createdAt: string;
  details?: DetailItem[];
}

export type PartnerOption = {
  id: string;
  name: string;
  data: PartnerDisposisi;
};

export type FormData = {
  recipient: string | null;
  recipientName: string;
  telephone: string;
  mobilePhone: string;
  email: string;
  website: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  type: string;
  name: string;
  skbSkt: string;
  skbSktDate: Date | null;
  invoiceNo: string | null;
  invoiceDate: Date | null;
  budgetType?: string;
  document?: string;
  schedule?: Date | null;
  immediate?: boolean;
  deliverySchedule?: string;
  realization?: boolean;
  title?: string;
  needs?: string;
  paymentTerms?: string;
  department?: string;
  pic?: string;
  allocation?: string;
  taxInvoiceFollows?: boolean;
};

export type SelectOption =
  | React.FormEvent<HTMLElement>
  | { data: PartnerDisposisi }
  | { value: string | number }
  | { id: string; name: string }
  | string
  | number
  | null;

export type ItemDetail = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  trxAmount: number;
  vatType: string;
  vatAmount: number;
  stType: string;
  stAmount: number;
  description: string;
  createdAt?: string;
};

export type PersonData = {
  id: string;
  type: string;
  npwp: string;
  skbSkt: string;
  skbSktDate: string | null;
  ktpNib: string;
  ktpNibName: string;
  recipientName: string;
  contactName: string;
  telephone: string;
  mobilePhone: string;
  city: string;
  postalCode: string;
  billingAddress: string;
  email: string;
  website: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePersonProps = {
  onSave?: (data: PersonData) => void;
  onUpdate?: (data: PersonData) => void;
  initialData?: PersonData;
  editMode?: boolean;
  onClose?: () => void;
};
