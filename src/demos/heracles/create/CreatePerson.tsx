import { useEffect, useState } from 'react';

import {
  bankOptions,
  ktpNibOptions,
  skbSktOptions,
  STORAGE_KEY_2,
  typeOptions,
} from './helper/constants';

import {
  IDialog,
  IFCDatepicker,
  IFCInput,
  IFCSelect,
  IFCTextArea,
  useDialogRef,
  useIAlertService,
} from '../../../components';
import type { CreatePersonProps, PersonData } from './helper/types';

const generateId = (): string => {
  return `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const formatDateToISO = (date: Date | null): string | null => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
};

const parseISODate = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const saveToLocalStorage = (
  data: PersonData,
  isEditMode: boolean = false
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const existingDataJSON = localStorage.getItem(STORAGE_KEY_2);
      let allData: PersonData[] = [];

      if (existingDataJSON) {
        try {
          allData = JSON.parse(existingDataJSON);
          if (!Array.isArray(allData)) {
            allData = [];
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          allData = [];
        }
      }

      const timestamp = new Date().toISOString();

      if (isEditMode) {
        const index = allData.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          allData[index] = {
            ...data,
            updatedAt: timestamp,
          };
        } else {
          allData.push({
            ...data,
            createdAt: data.createdAt || timestamp,
            updatedAt: timestamp,
          });
        }
      } else {
        const newData: PersonData = {
          ...data,
          id: generateId(),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        allData.push(newData);
      }

      localStorage.setItem(STORAGE_KEY_2, JSON.stringify(allData));
      resolve(true);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      resolve(false);
    }
  });
};

export function CreatePerson({
  onSave,
  onUpdate,
  initialData,
  editMode = false,
  onClose,
}: CreatePersonProps) {
  const dialogRef = useDialogRef<boolean>();
  const alert = useIAlertService();

  const [formData, setFormData] = useState<PersonData>({
    id: editMode && initialData ? initialData.id : generateId(),
    type: '',
    npwp: '',
    skbSkt: '',
    skbSktDate: null,
    ktpNib: '',
    ktpNibName: '',
    recipientName: '',
    contactName: '',
    telephone: '',
    mobilePhone: '',
    city: '',
    postalCode: '',
    billingAddress: '',
    email: '',
    website: '',
    bank: '',
    accountName: '',
    accountNumber: '',
    createdAt:
      editMode && initialData
        ? initialData.createdAt
        : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialData) {
      const processedData: PersonData = {
        ...initialData,
        skbSktDate: initialData.skbSktDate,
      };
      setFormData(processedData);
    }
  }, [initialData]);

  const handleSelectChange =
    (field: keyof PersonData) =>
    (value: React.FormEvent<HTMLElement> | string | null) => {
      let stringValue = '';

      if (typeof value === 'string') {
        stringValue = value;
      } else if (value === null) {
        stringValue = '';
      } else {
        const input = value?.currentTarget as HTMLSelectElement;
        stringValue = input.value;
      }
      setFormData((p) => (p ? { ...p, [field]: stringValue } : p));
    };

  const handleInputChange =
    (field: keyof PersonData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleTextareaChange = (field: keyof PersonData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange =
    (field: keyof PersonData) =>
    (value: React.FormEvent<HTMLElement> | Date | null) => {
      let dateValue: Date | null = null;
      if (value instanceof Date) {
        dateValue = value;
      } else if (value === null) {
        dateValue = null;
      } else {
        const input = value?.currentTarget as HTMLInputElement;
        dateValue = input.value ? new Date(input.value) : null;
      }
      setFormData((p) => ({ ...p, [field]: formatDateToISO(dateValue) }));
    };

  const validateForm = (): boolean => {
    const requiredFields: (keyof PersonData)[] = [
      'recipientName',
      'contactName',
      'telephone',
      'email',
      'billingAddress',
      'city',
      'accountName',
      'accountNumber',
    ];

    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const fieldName = getFieldLabel(field);
        errors.push(`${fieldName} harus diisi`);
      }
    });

    if (formData.email && !isValidEmail(formData.email)) {
      errors.push('Format email tidak valid');
    }

    if (
      formData.npwp &&
      formData.npwp.trim() !== '' &&
      !isValidNPWP(formData.npwp)
    ) {
      errors.push('Format NPWP tidak valid (contoh: 12.345.678.9-012.345)');
    }

    if (errors.length > 0) {
      alert.danger('Validasi Error', errors.join('\n'));
      return false;
    }

    return true;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidNPWP = (npwp: string): boolean => {
    const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}$/;
    return npwpRegex.test(npwp);
  };

  const getFieldLabel = (field: keyof PersonData): string => {
    const labels: Record<keyof PersonData, string> = {
      id: 'ID',
      type: 'Tipe',
      npwp: 'NPWP',
      skbSkt: 'SKB/SKT',
      skbSktDate: 'Tgl. SKB/SKT',
      ktpNib: 'KTP/NIB',
      ktpNibName: 'Nama KTP/NIB',
      recipientName: 'Nama Penerima',
      contactName: 'Nama Kontak',
      telephone: 'Telephone',
      mobilePhone: 'Mobile Phone',
      city: 'City',
      postalCode: 'Kode Pos',
      billingAddress: 'Alamat Tagihan',
      email: 'Email',
      website: 'Website',
      bank: 'Bank',
      accountName: 'Atas Nama',
      accountNumber: 'No. Rekening',
      createdAt: 'Dibuat',
      updatedAt: 'Diperbarui',
    };
    return labels[field];
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSave: PersonData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      const success = await saveToLocalStorage(dataToSave, editMode);

      if (success) {
        if (editMode && onUpdate) {
          onUpdate(dataToSave);
        } else if (!editMode && onSave) {
          onSave(dataToSave);
        }

        await alert.success(
          'Berhasil',
          editMode
            ? 'Data partner berhasil diperbarui!'
            : 'Data partner berhasil disimpan!'
        );

        dialogRef.close(true);

        if (onClose) {
          onClose();
        }
      } else {
        throw new Error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      await alert.danger('Error', 'Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  const formatNPWP = (value: string): string => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8)}`;
    if (digits.length <= 12)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9)}`;

    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9, 12)}.${digits.slice(12, 15)}`;
  };

  const handleNPWPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNPWP(e.target.value);
    setFormData((prev) => ({ ...prev, npwp: formatted }));
  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, telephone: value }));
  };

  const handleMobilePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, mobilePhone: value }));
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, postalCode: value }));
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, accountNumber: value }));
  };

  const getDateValue = (): Date | null => {
    return parseISODate(formData.skbSktDate);
  };

  return (
    <IDialog
      title={editMode ? 'Edit Partner Disposisi' : 'Add New Partner Disposisi'}
      onSave={handleSave}>
      <div className="space-y-4">
        {/* Row 1: Tipe, NPWP, SKB/SKT */}
        <div className="flex flex-fill gap-md align-center">
          <IFCSelect
            label="Tipe"
            className="w-full"
            options={typeOptions}
            value={formData.type}
          />
          <IFCInput
            label="NPWP"
            className="w-full"
            value={formData.npwp}
            onChange={handleNPWPChange}
            placeholder="12.345.678.9-012.345"
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-id-card',
            }}
          />
          <IFCSelect
            label="SKB/SKT"
            className="w-full"
            options={skbSktOptions}
            value={formData.skbSkt}
          />
        </div>

        {/* Row 2: Tgl SKB/SKT, KTP/NIB, Nama KTP/NIB */}
        <div className="flex flex-fill gap-md align-center">
          <IFCDatepicker
            label="Tgl. SKB/SKT"
            className="w-full"
            value={getDateValue()}
          />
          <IFCSelect
            label="KTP/NIB"
            className="w-full"
            options={ktpNibOptions}
            value={formData.ktpNib}
          />
          <IFCInput
            label="Nama KTP/NIB"
            className="w-full"
            value={formData.ktpNibName}
            onChange={handleInputChange('ktpNibName')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-id-card',
            }}
          />
        </div>

        {/* Row 3: Nama Penerima, Nama Kontak, Telephone */}
        <div className="flex flex-fill gap-md align-center">
          <IFCInput
            label="Nama Penerima"
            className="w-full"
            value={formData.recipientName}
            onChange={handleInputChange('recipientName')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-user',
            }}
          />
          <IFCInput
            label="Nama Kontak"
            className="w-full"
            value={formData.contactName}
            onChange={handleInputChange('contactName')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-user',
            }}
          />
          <IFCInput
            label="Telephone"
            className="w-full"
            value={formData.telephone}
            onChange={handleTelephoneChange}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-phone',
            }}
          />
        </div>

        {/* Row 4: Mobile Phone, City, Kode Pos */}
        <div className="flex flex-fill gap-md align-center">
          <IFCInput
            label="Mobile Phone"
            className="w-full"
            value={formData.mobilePhone}
            onChange={handleMobilePhoneChange}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-mobile-screen',
            }}
          />
          <IFCInput
            label="City"
            className="w-full"
            value={formData.city}
            onChange={handleInputChange('city')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-city',
            }}
          />
          <IFCInput
            label="Kode Pos"
            className="w-full"
            value={formData.postalCode}
            onChange={handlePostalCodeChange}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-location-dot',
            }}
          />
        </div>

        {/* Row 5: Alamat Tagihan */}
        <div className="flex flex-fill gap-md align-center">
          <IFCTextArea
            label="Alamat Tagihan"
            className="w-full"
            value={formData.billingAddress}
            onChange={handleTextareaChange('billingAddress')}
            rows={3}
          />
        </div>

        {/* Row 6: Email, Website, Bank */}
        <div className="flex flex-fill gap-md align-center">
          <IFCInput
            label="Email"
            className="w-full"
            value={formData.email}
            onChange={handleInputChange('email')}
            type="email"
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-envelope',
            }}
          />
          <IFCInput
            label="Website"
            className="w-full"
            value={formData.website}
            onChange={handleInputChange('website')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-globe',
            }}
          />
          <IFCSelect
            label="Bank"
            className="w-full"
            options={bankOptions}
            value={formData.bank}
          />
        </div>

        {/* Row 7: Atas Nama, No.Rek */}
        <div className="flex flex-fill gap-md align-center">
          <IFCInput
            label="Atas Nama"
            className="w-full"
            value={formData.accountName}
            onChange={handleInputChange('accountName')}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-user',
            }}
          />
          <IFCInput
            label="No.Rek"
            className="w-full"
            value={formData.accountNumber}
            onChange={handleAccountNumberChange}
            prepend={{
              type: 'icon',
              icon: 'fa-solid fa-credit-card',
            }}
          />
        </div>
      </div>
    </IDialog>
  );
}
