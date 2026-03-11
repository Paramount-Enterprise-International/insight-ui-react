/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IButton,
  IFCDatepicker,
  IFCInput,
  IFCSelect,
  IFCTextArea,
  IIcon,
  ISection,
  ISectionBody,
  ISectionHeader,
  useIAlertService,
  useIDialog,
  type ISelectChange,
} from '../../../components';
import './Create.css';
import { CreatePerson } from './CreatePerson';
import {
  STORAGE_KEY,
  allocationOptions,
  budgetTypeOptions,
  deliveryScheduleOptions,
  departmentOptions,
  documentOptions,
  picOptions,
  skbSktOptions,
} from './helper/constants';
import type {
  DispositionFormData,
  FormData,
  PartnerDisposisi,
  PartnerOption,
  SelectOption,
} from './helper/types';

export function Create() {
  const [partnerList, setPartnerList] = useState<PartnerOption[]>([]);
  const [personId, setPersonId] = useState<string>('');
  void personId;
  const navigate = useNavigate();
  const recipientOptions = partnerList;
  const [allForms, setAllForms] = useState<DispositionFormData[]>([]);

  const [formData, setFormData] = useState<FormData>({
    recipient: null,
    recipientName: '',
    telephone: '',
    mobilePhone: '',
    email: '',
    website: '',

    billingAddress: '',
    city: '',
    postalCode: '',

    bankName: '',
    accountNumber: '',
    accountHolder: '',

    type: '',
    name: '',
    budgetType: '',
    document: '',
    schedule: new Date(),
    immediate: false,
    deliverySchedule: '',
    realization: false,
    title: '',
    needs: '',
    paymentTerms: '',
    department: '',
    pic: '',
    allocation: '',
    taxInvoiceFollows: false,

    skbSkt: '',
    skbSktDate: new Date(),

    invoiceNo: null,
    invoiceDate: null,
  });

  const alert = useIAlertService();
  const dialog = useIDialog();

  useEffect(() => {
    const raw = localStorage.getItem('partner_disposisi_data');
    if (!raw) return;

    try {
      const data: PartnerDisposisi[] = JSON.parse(raw);

      const options: PartnerOption[] = data.map((item) => ({
        id: item.id,
        name: `${item.contactName} (${item.recipientName})`,
        data: item,
      }));

      setPartnerList(options);
    } catch (error) {
      console.error('Invalid partner_disposisi_data', error);
    }
  }, []);

  const createNewPerson = () => {
    console.log('Button clicked');
    const ref = dialog.open(CreatePerson, { width: '500px' });
    ref.afterClosed().then((result) => {
      console.log('Dialog closed with result:', result);
      const raw = localStorage.getItem('partner_disposisi_data');
      if (!raw) return;

      try {
        const data: PartnerDisposisi[] = JSON.parse(raw);

        const options: PartnerOption[] = data.map((item) => ({
          id: item.id,
          name: `${item.contactName} (${item.recipientName})`,
          data: item,
        }));

        setPartnerList(options);
      } catch (error) {
        console.error('Invalid partner_disposisi_data', error);
      }
    });
  };

  useEffect(() => {
    const savedForms = localStorage.getItem(STORAGE_KEY);
    if (savedForms) {
      try {
        const parsedForms = JSON.parse(savedForms);

        if (Array.isArray(parsedForms)) {
          setAllForms(parsedForms);
        } else {
          console.warn(
            'Data di localStorage bukan array, reset ke array kosong'
          );
          setAllForms([]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        setAllForms([]);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }, []);

  const handleSelectChange =
    (field: string) => (change: ISelectChange<string>) => {
      // let stringValue = '';

      // if (typeof change.value === 'string') {
      //   stringValue = change.value;
      // } else if (change.value === null) {
      //   stringValue = '';
      // } else {
      //   const select = change.value;
      //   stringValue = select.value;
      // }
      setFormData((prev) => ({ ...prev, [field]: change.value }));
    };

  const handleSelectChangeSelect =
    (field: string) => (change: ISelectChange<unknown>) => {
      const selected = change.value as SelectOption; // <- this is the actual selected row

      if (field === 'recipient') {
        if (selected && typeof selected === 'object' && 'data' in selected) {
          const partner = selected.data;
          console.log('Selected partner:', partner);

          setPersonId(partner.id);

          setFormData((prev) => ({
            ...prev,
            recipient: partner.id,
            recipientName: partner.contactName,
            telephone: partner.telephone,
            mobilePhone: partner.mobilePhone,
            email: partner.email,
            website: partner.website,
            billingAddress: partner.billingAddress,
            city: partner.city,
            postalCode: partner.postalCode,
            bankName: partner.bank,
            accountNumber: partner.accountNumber,
            accountHolder: partner.accountName,
            type: partner.type,
            name: partner.ktpNibName,

            skbSkt: String(partner.skbSkt) || '',
            skbSktDate: partner.skbSktDate
              ? new Date(partner.skbSktDate)
              : null,
          }));
        }
        return;
      }

      let value: string | number | null = null;

      if (selected === null) {
        value = null;
      } else if (typeof selected === 'string' || typeof selected === 'number') {
        value = selected;
      } else if (typeof selected === 'object') {
        if ('value' in selected) value = selected.value;
        else if ('id' in selected && 'name' in selected) value = selected.id;
      }

      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleDateChange =
    (field: keyof FormData) =>
    (value: string | FormEvent<HTMLElement> | Date | null) => {
      let dateValue: Date | null = null;

      if (value === null) {
        dateValue = null;
      } else if (value instanceof Date) {
        dateValue = value;
      } else if (typeof value === 'string') {
        dateValue = value ? new Date(value) : null;
      } else if (value && typeof value === 'object') {
        const input = value.currentTarget as HTMLInputElement;
        dateValue = input.value ? new Date(input.value) : null;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: dateValue,
      }));
    };

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleCheckboxChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
    };

  const requiredFieldsBySection = {
    'Informasi Disposisi': [
      { field: 'budgetType', label: 'Budget Type', type: 'select' },
      { field: 'document', label: 'Document', type: 'select' },
      { field: 'schedule', label: 'Schedule', type: 'date' },
      { field: 'deliverySchedule', label: 'Delivery Schedule', type: 'select' },
      { field: 'title', label: 'Judul', type: 'string' },
      { field: 'needs', label: 'Keperluan', type: 'string' },
      { field: 'paymentTerms', label: 'Ketentuan Pembayaran', type: 'string' },
      { field: 'department', label: 'Departement', type: 'select' },
      { field: 'pic', label: 'PIC', type: 'select' },
      { field: 'allocation', label: 'Alokasi', type: 'select' },
    ],
    'Dibayar Kepada': [
      { field: 'recipient', label: 'Pilih Penerima', type: 'select' },
      { field: 'recipientName', label: 'Nama Penerima', type: 'string' },
      { field: 'invoiceNo', label: 'No. Invoice', type: 'select' },
      { field: 'invoiceDate', label: 'Invoice Date', type: 'date' },
      { field: 'skbSkt', label: 'SKB/SKT', type: 'select' },
      { field: 'skbSktDate', label: 'Tgl. SKB/SKT', type: 'date' },
    ],
    'Informasi Kontak': [
      { field: 'type', label: 'Tipe', type: 'string' },
      { field: 'name', label: 'Nama', type: 'string' },
      { field: 'telephone', label: 'Telephone', type: 'string' },
      { field: 'mobilePhone', label: 'Mobile Phone', type: 'string' },
      { field: 'email', label: 'Email', type: 'email' },
      { field: 'billingAddress', label: 'Alamat Tagihan', type: 'string' },
      { field: 'city', label: 'Kota', type: 'string' },
      { field: 'postalCode', label: 'Kode Pos', type: 'string' },
    ],
    'Informasi Bank': [
      { field: 'bankName', label: 'Nama Bank', type: 'string' },
      { field: 'accountNumber', label: 'No. Rekening', type: 'string' },
      { field: 'accountHolder', label: 'Atas Nama', type: 'string' },
    ],
  };

  const handleSave = async () => {
    const sectionErrors: Record<string, string[]> = {};
    console.log('=== DEBUG DATE VALUES ===');
    const dateFields = ['schedule', 'invoiceDate', 'skbSktDate'];
    dateFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      console.log(`${field}:`, value);
      console.log(`  type:`, typeof value);
      console.log(`  instanceof Date:`, value instanceof Date);
      console.log(`  is null:`, value === null);
      console.log(`  is undefined:`, value === undefined);
      console.log(`  is empty string:`, value === '');
      console.log(
        `  isValidDate:`,
        value instanceof Date && !isNaN(value.getTime())
      );
      console.log('---');
    });

    Object.entries(requiredFieldsBySection).forEach(([sectionName, fields]) => {
      const errors: string[] = [];

      fields.forEach(({ field, label, type }) => {
        const value = formData[field as keyof typeof formData];
        let isEmpty = false;

        switch (type) {
          case 'date':
            isEmpty =
              !value || !(value instanceof Date) || isNaN(value.getTime());
            break;

          case 'select': {
            type SelectValue =
              | string
              | number
              | { id?: string | number; name?: string }
              | null;

            const selectValue = value as SelectValue;

            if (!selectValue) {
              isEmpty = true;
            } else if (typeof selectValue === 'string') {
              isEmpty = selectValue.trim() === '';
            } else if (typeof selectValue === 'number') {
              isEmpty = false;
            } else if (typeof selectValue === 'object') {
              if (selectValue instanceof Date) {
                isEmpty = true;
              } else {
                const hasId = 'id' in selectValue && Boolean(selectValue.id);
                const hasName =
                  'name' in selectValue && Boolean(selectValue.name);
                isEmpty = !hasId && !hasName;
              }
            }
            break;
          }

          case 'string':
            isEmpty = !value || (typeof value === 'string' && !value.trim());
            break;

          case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isEmpty =
              !value ||
              (typeof value === 'string' &&
                (!value.trim() || !emailRegex.test(value)));
            break;
          }

          default:
            isEmpty = !value;
        }

        if (isEmpty) {
          errors.push(label);
          console.log(`${field} (${label}) isEmpty:`, isEmpty, 'value:', value);
        }
      });

      if (errors.length > 0) {
        sectionErrors[sectionName] = errors;
      }
    });

    if (Object.keys(sectionErrors).length > 0) {
      let errorMessage = 'Harap lengkapi field berikut:\n\n';

      Object.entries(sectionErrors).forEach(([section, errors]) => {
        errorMessage += `${section}:\n`;
        errors.forEach((err) => {
          errorMessage += `• ${err}\n`;
        });
        errorMessage += '\n';
      });

      await alert.danger('Form Tidak Lengkap', errorMessage);
      return;
    }

    const newForm: DispositionFormData = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),

      recipient: formData.recipient || '',
      recipientName: formData.recipientName || '',
      telephone: formData.telephone || '',
      mobilePhone: formData.mobilePhone || '',
      email: formData.email || '',
      website: formData.website || '',
      billingAddress: formData.billingAddress || '',
      city: formData.city || '',
      postalCode: formData.postalCode || '',
      bankName: formData.bankName || '',
      accountNumber: formData.accountNumber || '',
      accountHolder: formData.accountHolder || '',
      type: formData.type || '',
      name: formData.name || '',
      budgetType: formData.budgetType || '',
      document: formData.document || '',
      deliverySchedule: formData.deliverySchedule || '',
      title: formData.title || '',
      needs: formData.needs || '',
      paymentTerms: formData.paymentTerms || '',
      department: formData.department || '',
      pic: formData.pic || '',
      allocation: formData.allocation || '',
      taxInvoiceFollows: formData.taxInvoiceFollows ?? false,
      immediate: formData.immediate ?? false,
      realization: formData.realization ?? false,

      schedule:
        formData.schedule instanceof Date
          ? formData.schedule.toISOString()
          : formData.schedule || '',
      skbSktDate:
        formData.skbSktDate instanceof Date
          ? formData.skbSktDate.toISOString()
          : formData.skbSktDate || '',
      invoiceDate:
        formData.invoiceDate instanceof Date
          ? formData.invoiceDate.toISOString()
          : formData.invoiceDate || '',

      skbSkt: formData.skbSkt || '',
      invoiceNo: formData.invoiceNo || '',
    };
    const currentForms = Array.isArray(allForms) ? allForms : [];
    const updatedForms = [...currentForms, newForm];
    console.log(updatedForms, 'updatedForms');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
    setAllForms(updatedForms);

    await alert.success('Succes', 'Data berhasil disimpan!');
    navigate('/');
  };
  const handleTextareaChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <ISection>
        <ISectionHeader>Informasi Disposisi</ISectionHeader>
        <ISectionBody>
          <div className="flex gap-md flex-fill align-center w-full pb-sm">
            <IFCSelect
              label="Budget Type"
              className="w-full"
              options={budgetTypeOptions}
              value={formData.budgetType}
              onChange={handleSelectChange('budgetType')}
            />
            <IFCSelect
              label="Document"
              className="w-full"
              options={documentOptions}
              value={formData.document}
              onChange={handleSelectChange('document')}
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full pb-sm">
            <IFCDatepicker
              label="Schedule"
              className="w-70"
              value={formData.schedule}
              onChange={handleDateChange('schedule')}
            />

            <div className="flex gap-md flex-fill align-center w-full pb-sm">
              <input
                type="checkbox"
                checked={formData.immediate}
                onChange={handleCheckboxChange('immediate')}
                className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <p>Segera</p>
            </div>
            <IFCSelect
              label="Delivery Schedule"
              className="w-70 pt-md"
              options={deliveryScheduleOptions}
              value={formData.deliverySchedule}
              onChange={handleSelectChange('deliverySchedule')}
            />
            <div className="flex gap-md flex-fill align-center w-full pb-sm">
              <input
                type="checkbox"
                checked={formData.realization}
                onChange={handleCheckboxChange('realization')}
                className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <p>Realisasi Uang Muka</p>
            </div>
          </div>

          <div>
            <IFCInput
              label="Judul"
              className="w-full"
              value={formData.title}
              onChange={handleInputChange('title')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-align-center',
              }}
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCTextArea
              label="Keperluan"
              className="w-full"
              value={formData.needs}
              onChange={handleTextareaChange('needs')}
            />
            <IFCTextArea
              label="Ketentuan Pembayaran"
              className="w-full"
              value={formData.paymentTerms}
              onChange={handleTextareaChange('paymentTerms')}
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCSelect
              label="Departement"
              className="w-full"
              options={departmentOptions}
              value={formData.department}
              onChange={handleSelectChange('department')}
            />
            <IFCSelect
              label="PIC"
              className="w-full"
              options={picOptions}
              value={formData.pic}
              onChange={handleSelectChange('pic')}
            />
            <IFCSelect
              label="Alokasi"
              className="w-full"
              options={allocationOptions}
              value={formData.allocation}
              onChange={handleSelectChange('allocation')}
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full pb-sm">
            <input
              type="checkbox"
              checked={formData.taxInvoiceFollows}
              onChange={handleCheckboxChange('taxInvoiceFollows')}
              className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <p>Faktur Pajak Menyusul</p>
          </div>
        </ISectionBody>
      </ISection>

      {/* Dibayar Kepada */}
      <ISection className="mt-lg">
        <ISectionHeader>Dibayar Kepada</ISectionHeader>
        <ISectionBody>
          <div className="flex gap-md flex-fill align-end w-full pb-sm">
            <IFCSelect
              label="Pilih Penerima"
              className="w-full"
              options={recipientOptions}
              value={formData.recipient}
              onChange={handleSelectChangeSelect('recipient')}
            />
            <IButton className="w-5" onClick={createNewPerson}>
              <IIcon icon="add" size="sm" />
            </IButton>
          </div>

          <div>
            <IFCInput
              label="Nama Penerima"
              className="w-full"
              value={formData.recipientName}
              onChange={handleInputChange('recipientName')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-user',
              }}
              readonly
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCSelect
              label="No. Invoice"
              className="w-full pt-md"
              options={['INV-001', 'INV-002']}
              value={formData.invoiceNo}
              onChange={handleSelectChange('invoiceNo')}
            />
            <IFCDatepicker
              label="Invoice Date"
              className="w-full"
              value={formData.invoiceDate}
              onChange={handleDateChange('invoiceDate')}
            />
            <IFCSelect
              label="SKB/SKT"
              className="w-full pt-md"
              options={skbSktOptions}
              value={formData.skbSkt}
              onChange={handleSelectChange('skbSkt')}
            />
            <IFCDatepicker
              label="Tgl. SKB/SKT"
              className="w-full"
              value={formData.skbSktDate}
              onChange={handleDateChange('skbSktDate')}
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCInput
              label="Tipe"
              className="w-full"
              value={formData.type}
              onChange={handleInputChange('type')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-bars-staggered',
              }}
              readonly
            />
            <IFCInput
              label="Nama"
              className="w-full"
              value={formData.name}
              onChange={handleInputChange('name')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-signature',
              }}
              readonly
            />
            <IFCInput
              label="Telephone"
              className="w-full"
              value={formData.telephone}
              onChange={handleInputChange('telephone')}
              prepend={{ type: 'icon', icon: 'fa-solid fa-tty' }}
              readonly
            />
            <IFCInput
              label="Mobile Phone"
              className="w-full"
              value={formData.mobilePhone}
              onChange={handleInputChange('mobilePhone')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-mobile-screen-button',
              }}
              readonly
            />
            <IFCInput
              label="Email"
              className="w-full"
              value={formData.email}
              onChange={handleInputChange('email')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-at',
              }}
              readonly
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
              readonly
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCInput
              label="Alamat Tagihan"
              className="w-full"
              value={formData.billingAddress}
              onChange={handleInputChange('billingAddress')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-house-chimney',
              }}
              readonly
            />
            <IFCInput
              label="Kota"
              className="w-full"
              value={formData.city}
              onChange={handleInputChange('city')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-city',
              }}
              readonly
            />
            <IFCInput
              label="Kode Pos"
              className="w-full"
              value={formData.postalCode}
              onChange={handleInputChange('postalCode')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-map-marker-alt',
              }}
              readonly
            />
          </div>

          <div className="flex gap-md flex-fill align-center w-full">
            <IFCInput
              label="Nama Bank"
              className="w-full"
              value={formData.bankName}
              onChange={handleInputChange('bankName')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-building-columns',
              }}
              readonly
            />
            <IFCInput
              label="No. Rekening"
              className="w-full"
              value={formData.accountNumber}
              onChange={handleInputChange('accountNumber')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-credit-card',
              }}
              readonly
            />
            <IFCInput
              label="Atas Nama"
              className="w-full"
              value={formData.accountHolder}
              onChange={handleInputChange('accountHolder')}
              prepend={{
                type: 'icon',
                icon: 'fa-solid fa-user',
              }}
              readonly
            />
          </div>
          <div className="flex flex-fill gap-md align-center w-full mb-lg p-sm justify-end">
            <IButton onClick={handleSave}>
              <IIcon icon="fa-solid fa-floppy-disk" size="sm" /> Save
            </IButton>
            <IButton variant="danger">
              <IIcon icon="fa-solid fa-xmark"></IIcon>Cancel
            </IButton>
          </div>
        </ISectionBody>
      </ISection>
    </>
  );
}
