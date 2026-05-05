import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  IDialog,
  IFCInput,
  useIAlert,
  useIDialogData,
  useIDialogRef,
} from '../../../components';
import type { ItemDetail } from './helper/types';

export function CreateItem() {
  const dialogRef = useIDialogRef<ItemDetail>();
  const data = useIDialogData<{ id: string }>();
  const alert = useIAlert();
  const [form, setForm] = useState<ItemDetail>({
    id: data.id,
    name: '',
    qty: 1,
    unit: 'pcs',
    price: 0,
    trxAmount: 0,
    vatType: 'none',
    vatAmount: 0,
    stType: 'none',
    stAmount: 0,
    description: '',
  });

  const handleSelectChange =
    (field: keyof ItemDetail) =>
    (
      value:
        | ChangeEvent<HTMLSelectElement>
        | FormEvent<HTMLElement>
        | string
        | null
    ) => {
      let stringValue = '';

      if (value === null) {
        stringValue = '';
      } else if (typeof value === 'string') {
        stringValue = value;
      } else if ('target' in value) {
        stringValue = (value.target as HTMLSelectElement).value;
      }

      setForm((p) => ({ ...p, [field]: stringValue }));
    };

  const setNumber =
    (key: keyof ItemDetail) =>
    (
      value:
        | FormEvent<HTMLElement>
        | ChangeEvent<HTMLInputElement>
        | string
        | null
    ) => {
      let stringValue = '';

      if (value === null) {
        stringValue = '';
      } else if (typeof value === 'string') {
        stringValue = value;
      } else if ('target' in value) {
        stringValue = (value.target as HTMLInputElement).value;
      }

      const raw = stringValue.replace(/\D/g, '');
      setForm((p) => ({ ...p, [key]: Number(raw) || 0 }));
    };

  const incQty = () => setForm((p) => ({ ...p, qty: p.qty + 1 }));

  const decQty = () => setForm((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }));

  useEffect(() => {
    const trxAmount = form.qty * form.price;

    const vatAmount = form.vatType === 'ppn11' ? trxAmount * 0.11 : 0;

    const stAmount = form.stType === 'pph21' ? trxAmount * 0.025 : 0;

    setForm((p) => ({
      ...p,
      trxAmount,
      vatAmount: Math.round(vatAmount),
      stAmount: Math.round(stAmount),
    }));
  }, [form.qty, form.price, form.vatType, form.stType]);

  const STORAGE_KEY = 'invoice_items';

  const handleSave = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items: ItemDetail[] = raw ? JSON.parse(raw) : [];

      items.push({
        ...form,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      alert.success('Succes', 'Data berhasil disimpan!');

      dialogRef.close(form);
    } catch (error) {
      console.error('Gagal menyimpan item:', error);
      alert.danger('Error', 'Gagal menyimpan data!');
    }
  };

  return (
    <IDialog
      title="Add Item"
      onSave={handleSave}
      actions={[
        { type: 'cancel', className: 'w-32' },
        { type: 'save', className: 'w-32' },
      ]}>
      <div className="space-y-4">
        {/* ROW 1 */}
        <div className="flex gap-md align-center">
          <IFCInput
            label="Item"
            className="w-full"
            value={form.name}
            onChange={handleSelectChange('name')}
            placeholder="Product / Service Name"
          />

          {/* QTY */}
          <div className="w-32">
            <label className="text-sm">Qty</label>
            <div className="flex align-center gap-xs">
              <IFCInput
                value={form.qty.toString()}
                onChange={setNumber('qty')}
                append={[
                  {
                    type: 'button',
                    icon: 'fa-solid fa-minus',
                    onClick: decQty,
                  } as const,
                  {
                    type: 'button',
                    icon: 'add',
                    onClick: incQty,
                  } as const,
                ]}
              />
            </div>
          </div>
          {/* 
          <IFCSelect
            label="Unit"
            className="w-32"
            options={unitOptions}
            value={form.unit.toString()}
            onChange={handleSelectChange('unit')}
          /> */}

          {/* PRICE */}
          <IFCInput
            label="Price"
            className="w-48"
            value={form.price.toLocaleString()}
            onChange={setNumber('price')}
            placeholder="0"
          />

          {/* TRX AMOUNT */}
          <IFCInput
            label="Trx Amount"
            className="w-48"
            value={form.trxAmount.toLocaleString()}
            readonly
          />
        </div>

        {/* ROW 2 */}
        <div className="flex gap-md align-center">
          {/* <IFCSelect
            label="VAT"
            className="w-48"
            options={vatOptions}
            value={form.vatType}
            onChange={handleSelectChange('vatType')}
          /> */}
          <IFCInput
            label="VAT Amt"
            className="w-48"
            value={form.vatAmount.toLocaleString()}
            readonly
          />

          {/* <IFCSelect
            label="ST"
            className="w-48"
            options={stOptions}
            value={form.stType}
            onChange={handleSelectChange('stType')}
          /> */}
          <IFCInput
            label="ST Amt"
            className="w-48"
            value={form.stAmount.toLocaleString()}
            readonly
          />
        </div>

        {/* ROW 3 */}
        {/* <IFCTextarea
          label="Description (HANYA UTK CATATAN INTERNAL TIDAK AKAN DICETAK)"
          value={form.description}
          rows={3}
          onChange={handleSelectChange('description')}
        /> */}
      </div>
    </IDialog>
  );
}
