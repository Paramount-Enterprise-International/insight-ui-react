/* eslint-disable react-hooks/set-state-in-effect */
const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IButton,
  IGrid,
  IGridColumn,
  IGridDataSource,
  IGridExpandableRow,
  IIcon,
  IInput,
  ISection,
  ISectionBody,
  ISectionFilter,
  ISectionHeader,
} from '../../components';

interface DetailItem {
  itemName: string;
  quantity: number;
  unit: string;
  description?: string;
  price: number;
  subtotal: number;
  ppn: number;
  grandTotal: number;
  dpp: number;
}

interface InvoiceItem {
  id?: string | number;
  name?: string;
  dispositionId?: string | number;
  recipientName?: string;
  trxAmount?: string | number;
  vatAmount?: string | number;
  stAmount?: string | number;
  qty?: number;
  unit?: string;
  description?: string;
  price?: number;
}

interface StorageItem {
  id: string | number;
  recipientName?: string;
  needs?: string;
  budgetType?: string;
  pic?: string;
  realization?: boolean;
  schedule?: string;
  invoiceDate?: string;
  createdAt?: string;
  accountHolder?: string;
  details?: Array<{ grandTotal?: string | number }>;
}

interface DetailItem {
  itemName: string;
  quantity: number;
  unit: string;
  description?: string;
  price: number;
  dpp: number;
  ppn: number;
  subtotal: number;
  grandTotal: number;
}

type UserRow = {
  id: number;
  name: string;
  description: string;
  budget: string;
  pic: string;
  status: string;
  amount: string;
  date: Date;
  due: Date;
  payment: string;
  outstanding: string;
  createuser: string;
  createdate: Date;
  details?: DetailItem[];
};

type Status = {
  id: number;
  name: string;
};
const parseCustomDate = (dateStr: string): Date => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]) + 2000;
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

const STORAGE_KEY = 'disposition_form_data';

type filters = {
  name: string;
  status?: string;
  dataRange: {
    start: Date | null;
    end: Date | null;
  };
};

export function Dashboard() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<filters>({
    name: '',
    status: '',
    dataRange: {
      start: null,
      end: null,
    },
  });
  const [inputValue, setInputValue] = useState('');
  const [inputValueDiposisi, setInputValueDiposisis] = useState('');
  const [selectStatus, setStatus] = useState<Status | null>();
  const [dateFrom, setDateFrom] = useState<Date | null>();
  const [dateTo, setDateTo] = useState<Date | null>();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(true);
  const [tempFilters, setTempFilters] = useState({
    status: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    search: '',
    disposition: '',
  });

  const status: Status[] = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Non Active' },
  ];

  void selectStatus;
  void status;

  const getDispositionFromStorage = useCallback((): UserRow[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed: StorageItem[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.error('Invalid data format in localStorage');
        return [];
      }

      let invoiceItems: InvoiceItem[] = [];
      try {
        const invoiceItemsRaw = localStorage.getItem('invoice_items');
        if (invoiceItemsRaw) {
          const parsedInvoiceItems = JSON.parse(invoiceItemsRaw);
          invoiceItems = Array.isArray(parsedInvoiceItems)
            ? parsedInvoiceItems
            : [];
        }
      } catch (invoiceError) {
        console.error('Failed to parse invoice_items:', invoiceError);
      }

      console.log('Total invoice items:', invoiceItems.length);
      console.log('Invoice items sample:', invoiceItems.slice(0, 3));

      return parsed.map((item: StorageItem): UserRow => {
        console.log(`Processing disposition ${item.id}: ${item.recipientName}`);

        const relatedInvoiceItems = invoiceItems.filter((invoiceItem) => {
          const exactMatch = invoiceItem.id === item.id;

          const dispositionMatch = invoiceItem.dispositionId === item.id;

          return exactMatch || dispositionMatch;
        });

        console.log(
          `Found ${relatedInvoiceItems.length} invoice items for ${item.id}`
        );

        let totalAmount = 0;
        if (relatedInvoiceItems.length > 0) {
          totalAmount = relatedInvoiceItems.reduce((sum, invoiceItem) => {
            const trxAmount = Number(invoiceItem.trxAmount) || 0;
            const vatAmount = Number(invoiceItem.vatAmount) || 0;
            const stAmount = Number(invoiceItem.stAmount) || 0;
            return sum + trxAmount + vatAmount + stAmount;
          }, 0);

          console.log(`Total amount for ${item.id}: ${totalAmount}`);
        } else if (Array.isArray(item.details)) {
          totalAmount = item.details.reduce((sum, detail) => {
            const detailAmount = Number(detail.grandTotal) || 0;
            return sum + detailAmount;
          }, 0);
        } else {
          console.log(`No invoice items found for ${item.id}, amount = 0`);
        }

        const payment = 0;
        const outstandingAmount = totalAmount - payment;

        const parseDate = (dateString: string | undefined): Date => {
          if (!dateString) return new Date();
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? new Date() : date;
        };

        return {
          id: Number(item.id) || 0,
          name: item.recipientName || '-',
          description: item.needs || 'No description',
          budget: item.budgetType || '-',
          pic: item.pic || '-',
          status: item.realization ? 'Active' : 'Non Active',
          amount: formatCurrency(totalAmount),
          outstanding: formatCurrency(outstandingAmount),
          payment: formatCurrency(payment),
          date: parseDate(item.schedule),
          due: parseDate(item.invoiceDate),
          createdate: parseDate(item.createdAt),
          createuser: item.accountHolder || '-',
          details: relatedInvoiceItems.map(
            (invoiceItem): DetailItem => ({
              itemName: invoiceItem.name || 'Unnamed Item',
              quantity: invoiceItem.qty || 0,
              unit: invoiceItem.unit || '',
              description: invoiceItem.description || '',
              price: invoiceItem.price || 0,
              dpp: Number(invoiceItem.trxAmount) || 0,
              ppn: Number(invoiceItem.vatAmount) || 0,
              subtotal:
                (Number(invoiceItem.trxAmount) || 0) +
                (Number(invoiceItem.vatAmount) || 0) +
                (Number(invoiceItem.stAmount) || 0),
              grandTotal:
                (Number(invoiceItem.trxAmount) || 0) +
                (Number(invoiceItem.vatAmount) || 0) +
                (Number(invoiceItem.stAmount) || 0),
            })
          ),
        };
      });
    } catch (error) {
      console.error('Failed to parse disposition_form_data', error);
      return [];
    }
  }, []);

  
  function handleUpdate(id: number) {
    navigate(`/docs/demos/heracles/edit/${id}`);
  }

  useEffect(() => {
    const data = getDispositionFromStorage();
    console.log(data, 'data');
    setRows(data);
  }, [getDispositionFromStorage]);

  // const applyFilters = (data: UserRow[], filters: filters) => {
  //   let filterResult = [...data];
  //   if (filters.name && filters.name.trim() !== '') {
  //     const searchName = filters.name.toLocaleLowerCase();
  //     filterResult = filterResult.filter((x) =>
  //       x.name.toLocaleLowerCase().includes(searchName)
  //     );
  //   }

  //   if (filters.status && filters.status.trim() !== '') {
  //     console.log('Filtering by status:', filters.status);
  //     filterResult = filterResult.filter((x) => {
  //       const match = x.status === filters.status;
  //       console.log(
  //         `Checking ${x.name}: ${x.status} === ${filters.status}? ${match}`
  //       );
  //       return match;
  //     });
  //   }

  //   console.log('Data after filter:', filterResult.length);

  //   if (filter.dataRange.start && filter.dataRange.end) {
  //     filterResult = filterResult.filter((x) => {
  //       try {
  //         let itemDate: Date;

  //         if (isNaN(new Date(x.date).getTime())) {
  //           itemDate = parseCustomDate(x.date.toString());
  //         } else {
  //           itemDate = new Date(x.date);
  //         }

  //         if (isNaN(itemDate.getTime())) {
  //           console.warn(`Invalid date for item ${x.id}: ${x.date}`);
  //           return false;
  //         }

  //         const startDate = new Date(filters.dataRange!.start!);
  //         const endDate = new Date(filters.dataRange!.end!);

  //         // Set waktu untuk komparasi yang tepat
  //         startDate.setHours(0, 0, 0, 0);
  //         endDate.setHours(23, 59, 59, 999);
  //         itemDate.setHours(0, 0, 0, 0);

  //         const itemTime = itemDate.getTime();
  //         const startTime = startDate.getTime();
  //         const endTime = endDate.getTime();

  //         console.log(
  //           `Date check: ${itemDate} between ${startDate} and ${endDate}? ${itemTime >= startTime && itemTime <= endTime}`
  //         );

  //         return itemTime >= startTime && itemTime <= endTime;
  //       } catch (error) {
  //         console.error(`Error checking date for item ${x.id}:`, error);
  //         return false;
  //       }
  //     });
  //   }

  //   return filterResult;
  // };
  const applyFilters = useCallback((data: UserRow[], filters: filters) => {
    let filterResult = [...data];

    if (filters.name && filters.name.trim() !== '') {
      const searchName = filters.name.toLocaleLowerCase();
      filterResult = filterResult.filter((x) =>
        x.name.toLocaleLowerCase().includes(searchName)
      );
    }

    if (filters.status && filters.status.trim() !== '') {
      console.log('Filtering by status:', filters.status);
      filterResult = filterResult.filter((x) => {
        const match = x.status === filters.status;
        console.log(
          `Checking ${x.name}: ${x.status} === ${filters.status}? ${match}`
        );
        return match;
      });
    }

    console.log('Data after filter:', filterResult.length);

    if (filters.dataRange && filters.dataRange.start && filters.dataRange.end) {
      filterResult = filterResult.filter((x) => {
        try {
          let itemDate: Date;

          if (isNaN(new Date(x.date).getTime())) {
            itemDate = parseCustomDate(x.date.toString());
          } else {
            itemDate = new Date(x.date);
          }

          if (isNaN(itemDate.getTime())) {
            console.warn(`Invalid date for item ${x.id}: ${x.date}`);
            return false;
          }

          const startDate = new Date(filters.dataRange!.start!);
          const endDate = new Date(filters.dataRange!.end!);

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          itemDate.setHours(0, 0, 0, 0);

          const itemTime = itemDate.getTime();
          const startTime = startDate.getTime();
          const endTime = endDate.getTime();

          console.log(
            `Date check: ${itemDate} between ${startDate} and ${endDate}? ${itemTime >= startTime && itemTime <= endTime}`
          );

          return itemTime >= startTime && itemTime <= endTime;
        } catch (error) {
          console.error(`Error checking date for item ${x.id}:`, error);
          return false;
        }
      });
    }

    return filterResult;
  }, []);
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputValue(value);

    setTempFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleInputDiposisi = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputValueDiposisis(value);

    setTempFilters((prev) => ({
      ...prev,
      disposition: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('Input blurred:', e.currentTarget?.value);
  };

  const handleBlurDiposisi = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('Input blurred:', e.currentTarget?.value);
  };

  const setSelectedStatus = (status: Status | null) => {
    setStatus(status);

    const statusName = status?.name || '';
    setTempFilters((prev) => ({
      ...prev,
      status: statusName,
    }));

    if (status) {
      console.log(status.name, 'ini adalah status');
    } else {
      console.log('Status cleared');
    }
  };

  void setSelectedStatus;

  const handleDateToChange = (value: FormEvent<HTMLElement> | Date | null) => {
    let selectedDate: Date | null = null;

    if (value instanceof Date) {
      selectedDate = value;
    } else if (value === null) {
      selectedDate = null;
    } else {
      const input = value.currentTarget as HTMLInputElement;
      selectedDate = input.value ? new Date(input.value) : null;
    }

    setDateTo(selectedDate);
  };

  const handleDateFromChange = (
    value: FormEvent<HTMLElement> | Date | null
  ) => {
    let selectedDate: Date | null = null;

    if (value instanceof Date) {
      selectedDate = value;
    } else if (value === null) {
      selectedDate = null;
    } else {
      const input = value.currentTarget as HTMLInputElement;
      selectedDate = input.value ? new Date(input.value) : null;
    }

    setDateFrom(selectedDate);
    console.log(selectedDate, 'dateFrom');
  };

  void handleDateToChange;
  void handleDateFromChange;

  const handleFilters = () => {
    console.log(tempFilters, 'ini adalah filter cek');
    setIsFiltered(false);
    setFilter({
      name: tempFilters.search || '',
      status: tempFilters.status,
      dataRange: {
        start: dateFrom ? dateFrom : null,
        end: dateTo ? dateTo : null,
      },
    });
  };

  const handleResetFilters = () => {
    setInputValue('');
    setInputValueDiposisis('');
    setStatus(null);
    setDateFrom(null);
    setDateTo(null);

    setTempFilters({
      status: '',
      dateFrom: null,
      dateTo: null,
      search: '',
      disposition: '',
    });

    setFilter({
      name: '',
      status: '',
      dataRange: {
        start: null,
        end: null,
      },
    });
    setIsFiltered(true);

    console.log('All filters have been cleared');
  };

  const dataSource = useMemo(() => {
    const filteredData = applyFilters(rows, filter);

    return new IGridDataSource<UserRow>(filteredData, {
      paginator: {
        pageIndex: 0,
        pageSize: 5,
        pageSizeOptions: [5, 10, 20],
      },
    });
  }, [rows, filter, applyFilters]);

  const createRoute = () => {
    console.log('Create route clicked');
    navigate('/docs/demos/heracles/create');
  };

  return (
    <>
      <ISection>
        <ISectionHeader>Heracles</ISectionHeader>
        <ISectionFilter className="flex gap-md flex-fill align-center w-full pb-sm">
          {/* <IDatepicker
            onChange={handleDateFromChange}
            value={dateFrom}
            placeholder="Disposisi Date From"></IDatepicker>

          <IDatepicker
            onChange={handleDateToChange}
            value={dateTo}
            placeholder="Disposisi Date To"></IDatepicker> */}
          <IInput
            placeholder="Diposis Number"
            value={inputValueDiposisi}
            onInput={handleInputDiposisi}
            onBlur={handleBlurDiposisi}></IInput>
          {/* <ISelect
            placeholder="Status"
            options={status}
            value={selectStatus}
            onChange={(status) => setSelectedStatus(status)}></ISelect> */}
          <IInput
            placeholder="Search..."
            value={inputValue}
            onInput={handleInput}
            onBlur={handleBlur}
            className="w-full"></IInput>
          <div>
            {isFiltered ? (
              <IButton onClick={handleFilters}>
                <IIcon icon="fa-solid fa-magnifying-glass" size="sm" />
                FIlter
              </IButton>
            ) : (
              <IButton onClick={handleResetFilters}>
                <IIcon icon="fa-solid fa-magnifying-glass" size="sm" />
                Clear
              </IButton>
            )}
          </div>
          <div>
            <IButton onClick={createRoute}>
              <IIcon icon="add" size="sm" />
              Create
            </IButton>
          </div>
        </ISectionFilter>
        <ISectionBody>
          <IGrid<UserRow>
            dataSource={dataSource}
            onExpandedRowsChange={(rows) =>
              console.log('expandedRowsChange', rows)
            }
            onRowClick={(row) => console.log('rowClick', row)}
            onRowExpandChange={(e) => console.log('rowExpandChange', e)}
            onSelectionChange={(e) => console.log('selectionChange', e)}>
            <IGridColumn<UserRow>
              fieldName="name"
              title="Name"
              width="fill"
              cellDef={(row: UserRow) => (
                <div className="font-semibold">{row.name}</div>
              )}
            />

            <IGridColumn<UserRow>
              fieldName="description"
              title="description"
              width={260}
              cellDef={(row: UserRow) => (
                <span className="text-subtle truncate">{row.description}</span>
              )}
            />

            <IGridColumn<UserRow>
              fieldName="budget"
              title="Budget"
              width={160}
            />
            <IGridColumn<UserRow> fieldName="pic" title="PIC" width={160} />
            <IGridColumn<UserRow>
              fieldName="status"
              title="Status"
              width={160}
            />
            <IGridColumn<UserRow>
              fieldName="amount"
              title="Amount"
              width={160}
            />
            <IGridColumn<UserRow>
              fieldName="outstanding"
              title="Outstanding"
              width={160}
            />
            <IGridExpandableRow<UserRow>
              render={(row) => (
                <div className="w-full px-4 py-3 text-sm text-gray-700">
                  {/* HEADER INFO */}
                  <div className="space-y-2">
                    <div className="flex border-b border-gray-200 pb-2">
                      <div className="w-48 font-semibold text-gray-600">
                        Disposisi No.
                      </div>
                      <div className="flex-1">{row.id}</div>
                    </div>

                    <div className="flex border-b border-gray-200 pb-2">
                      <div className="w-48 font-semibold text-gray-600">
                        Description
                      </div>
                      <div className="flex-1">{row.description}</div>
                    </div>

                    <div className="flex border-b border-gray-200 pb-2">
                      <div className="w-48 font-semibold text-gray-600">
                        Status
                      </div>
                      <div className="flex-1">{row.status}</div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-4">
                    <div className="font-semibold text-gray-700 mb-3">
                      Disposisi Detail :
                    </div>

                    {row.details?.length === 0 ? (
                      <div className="text-gray-400 text-sm italic py-2">
                        No details available
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                Item Name
                              </th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 border-l border-gray-200">
                                Quantity
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200 border-l border-gray-200">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.details?.map((d, i) => (
                              <tr
                                key={i}
                                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">
                                  {d.itemName}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600 border-l border-gray-200">
                                  {d.quantity} {d.unit}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900 border-l border-gray-200">
                                  {d.grandTotal}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-fill gap-md mt-4">
                    <IButton onClick={() => handleUpdate(row.id)}>
                      {' '}
                      <IIcon icon="fa-solid fa-file-pen" size="sm" /> Update
                      Disposisi
                    </IButton>
                    <IButton variant="warning">
                      <IIcon icon="fa-solid fa-undo" size="sm" /> Undo Approve
                      Disposisi
                    </IButton>
                    <IButton variant="warning">
                      <IIcon icon="fa-solid fa-signature" size="sm" /> Disposisi
                      Digital Sign
                    </IButton>
                    <IButton>
                      <IIcon icon="fa-solid fa-paperclip" size="sm" />
                      Attachment List
                    </IButton>
                  </div>
                </div>
              )}
            />
          </IGrid>
        </ISectionBody>
      </ISection>
    </>
  );
}
