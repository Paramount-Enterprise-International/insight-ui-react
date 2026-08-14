import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  IGrid,
  IGridColumn,
  IGridDataSource,
  type IGridHandle,
  type IGridProps,
} from './grid';

describe('IGrid', () => {
  it('renders basic grid structure', async () => {
    const dataSource = new IGridDataSource([{ name: 'Alice' }]);

    const { container } = render(
      <IGrid dataSource={dataSource}>
        <IGridColumn title="Name" fieldName="name" />
      </IGrid>
    );

    expect(container.querySelector('i-grid')).toBeTruthy();
    expect(container.querySelector('i-grid-header-row')).toBeTruthy();

    await waitFor(() => {
      expect(container.querySelector('i-grid-row')).toBeTruthy();
    });
  });
});

describe('IGridDataSource server-side delegation', () => {
  it('delegates sort, page, and filter changes without applying local transforms', () => {
    const onSortChange = vi.fn();
    const onPageChange = vi.fn();
    const onFilterChange = vi.fn();
    const dataSource = new IGridDataSource(
      [
        { id: 2, name: 'Bravo' },
        { id: 1, name: 'Alpha' },
      ],
      {
        paginator: { pageSize: 1 },
        serverSide: {
          totalRowCount: 12,
          onSortChange,
          onPageChange,
          onFilterChange,
        },
      }
    );
    const rendered = vi.fn();
    const unsubscribe = dataSource.connect(rendered);

    dataSource.sort = { active: 'name', direction: 'asc' };
    dataSource.filter = 'alpha';
    dataSource.paginator = { pageIndex: 2, pageSize: 5 };

    expect(onSortChange).toHaveBeenCalledWith([
      { active: 'name', direction: 'asc' },
    ]);
    expect(onFilterChange).toHaveBeenCalledWith('alpha');
    expect(onPageChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 5 });
    expect(dataSource.length).toBe(12);
    expect(rendered).toHaveBeenLastCalledWith([
      { id: 2, name: 'Bravo' },
      { id: 1, name: 'Alpha' },
    ]);

    unsubscribe();
  });

  it('updates rows and pagination metadata through setData', () => {
    const dataSource = new IGridDataSource<{ id: number }>([], {
      serverSide: { totalRowCount: 0, onPageChange: vi.fn() },
    });

    dataSource.setData([{ id: 7 }], {
      total: 31,
      pageIndex: 2,
      pageSize: 15,
    });

    expect(dataSource.data).toEqual([{ id: 7 }]);
    expect(dataSource.length).toBe(31);
    expect(dataSource.paginator).toEqual({ pageIndex: 2, pageSize: 15 });
  });
});

describe('IGrid sort behavior', () => {
  type TestRow = { firstName: string; lastName: string };

  function renderSortableGrid(props: Partial<IGridProps<TestRow>> = {}) {
    const dataSource = new IGridDataSource([
      { firstName: 'Ada', lastName: 'Lovelace' },
      { firstName: 'Grace', lastName: 'Hopper' },
    ]);

    const view = render(
      <IGrid dataSource={dataSource} {...props}>
        <IGridColumn fieldName="firstName" title="First name" />
        <IGridColumn fieldName="lastName" title="Last name" />
      </IGrid>
    );

    return { dataSource, ...view };
  }

  it('accumulates sort states in multi mode', () => {
    const { dataSource } = renderSortableGrid();
    const firstNameHeader = screen
      .getByText('First name')
      .closest('i-grid-header-cell');

    fireEvent.click(firstNameHeader!);
    fireEvent.click(
      screen.getByText('Last name').closest('i-grid-header-cell')!
    );

    expect(dataSource.sort).toEqual([
      { active: 'firstName', direction: 'asc' },
      { active: 'lastName', direction: 'asc' },
    ]);
  });

  it('replaces prior sorting in single mode', () => {
    const { dataSource } = renderSortableGrid({ sortMode: 'single' });
    const firstNameHeader = screen
      .getByText('First name')
      .closest('i-grid-header-cell');

    fireEvent.click(firstNameHeader!);
    fireEvent.click(
      screen.getByText('Last name').closest('i-grid-header-cell')!
    );

    expect(dataSource.sort).toEqual([
      { active: 'lastName', direction: 'asc' },
    ]);
  });

  it('emits server-side sort output from the grid callback contract', () => {
    const onServerSortChange = vi.fn();
    const { container } = renderSortableGrid({ onServerSortChange });
    const header = container.querySelectorAll('i-grid-header-cell')[1];

    fireEvent.click(header);

    expect(onServerSortChange).toHaveBeenCalledWith([
      { active: 'firstName', direction: 'asc' },
    ]);
  });

  it('uses a percentage flex-basis for fill columns', () => {
    render(
      <IGrid dataSource={[{ name: 'Ada' }]}>
        <IGridColumn fieldName="name" title="Name" width="fill" />
      </IGrid>
    );

    expect(screen.getByText('Name').closest('i-grid-header-cell')).toHaveStyle(
      'flex: 1 1 0%'
    );
  });
});

describe('IGrid selection eligibility', () => {
  type SelectionRow = { id: number; name: string; disabled?: boolean; hidden?: boolean };

  function renderSelectionGrid(
    props: Partial<IGridProps<SelectionRow>> = {},
    ref?: React.Ref<IGridHandle<SelectionRow>>
  ) {
    const rows: SelectionRow[] = [
      { id: 1, name: 'Available' },
      { id: 2, name: 'Disabled', disabled: true },
      { id: 3, name: 'Hidden', hidden: true },
    ];

    return {
      rows,
      ...render(
        <IGrid
          ref={ref}
          dataSource={rows}
          selectionMode="multiple"
          showNumberColumn={false}
          selectionRowDisabled={(row) => !!row.disabled}
          selectionRowHidden={(row) => !!row.hidden}
          {...props}>
          <IGridColumn fieldName="name" title="Name" />
        </IGrid>
      ),
    };
  }

  it('excludes hidden and disabled rows from select-all', () => {
    const onSelectionChange = vi.fn();
    const { rows, container } = renderSelectionGrid({ onSelectionChange });

    const checkboxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    fireEvent.click(checkboxes[0]);

    expect(onSelectionChange).toHaveBeenLastCalledWith({
      selected: [rows[0]],
      lastChanged: null,
    });
    expect(checkboxes[2]).toBeDisabled();
    expect(container.querySelectorAll('.i-grid-selection-spacer')).toHaveLength(1);
  });

  it('sets eligible rows atomically through the grid ref', () => {
    const onSelectionChange = vi.fn();
    const ref = { current: null } as React.MutableRefObject<IGridHandle<SelectionRow> | null>;
    const { rows } = renderSelectionGrid({ onSelectionChange }, ref);

    act(() => {
      ref.current?.setSelected([rows[0], rows[1], rows[2]]);
    });

    expect(ref.current?.getSelected()).toEqual([rows[0]]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith({
      selected: [rows[0]],
      lastChanged: null,
    });
  });

  it('toggles a selectable tree row when its row body is clicked', () => {
    type TreeRow = { id: number; name: string; children?: TreeRow[] };
    const root: TreeRow = { id: 1, name: 'Root' };
    const onSelectionChange = vi.fn();
    const { container } = render(
      <IGrid
        dataSource={[root]}
        selectionMode="multiple"
        showNumberColumn={false}
        tree
        onSelectionChange={onSelectionChange}>
        <IGridColumn fieldName="name" title="Name" />
      </IGrid>
    );

    fireEvent.click(container.querySelector('i-grid-row')!);

    expect(onSelectionChange).toHaveBeenCalledWith({
      selected: [root],
      lastChanged: root,
    });
  });
});
