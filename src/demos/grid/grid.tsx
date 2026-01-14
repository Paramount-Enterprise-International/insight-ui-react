import { useMemo } from 'react';
import { IButton } from '../../components/button';
import {
  IGrid,
  IGridColumn,
  IGridColumnGroup,
  IGridCustomColumn,
  IGridExpandableRow,
} from '../../components/grid/grid';
import { IGridDataSource } from '../../components/grid/grid-data-source';
import {
  ISection,
  ISectionBody,
  ISectionHeader,
} from '../../components/section';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
};

const MOCK: UserRow[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Admin',
    department: 'IT',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    role: 'User',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'User',
    department: 'Ops',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Diana',
    email: 'diana@example.com',
    role: 'Manager',
    department: 'Sales',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Evan',
    email: 'evan@example.com',
    role: 'User',
    department: 'Support',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Fiona',
    email: 'fiona@example.com',
    role: 'Admin',
    department: 'IT',
    status: 'Inactive',
  },
  {
    id: 7,
    name: 'Gabe',
    email: 'gabe@example.com',
    role: 'User',
    department: 'Ops',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Hana',
    email: 'hana@example.com',
    role: 'Manager',
    department: 'HR',
    status: 'Active',
  },
];

type TreeNode = {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  children?: TreeNode[];
};

const TREE_DATA: TreeNode[] = [
  {
    id: 1,
    name: 'Root A',
    status: 'Active',
    children: [
      { id: 11, name: 'Child A.1', status: 'Active' },
      {
        id: 12,
        name: 'Child A.2',
        status: 'Inactive',
        children: [
          { id: 121, name: 'Grandchild A.2.1', status: 'Active' },
          { id: 122, name: 'Grandchild A.2.2', status: 'Inactive' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Root B',
    status: 'Inactive',
    children: [
      { id: 21, name: 'Child B.1', status: 'Active' },
      { id: 22, name: 'Child B.2', status: 'Inactive' },
    ],
  },
];

export function Grid() {
  const dataSource = useMemo(
    () =>
      new IGridDataSource<UserRow>(MOCK, {
        paginator: {
          pageIndex: 0,
          pageSize: 5,
          pageSizeOptions: [5, 10, 20],
        },
      }),
    []
  );

  const treeDataSource = useMemo(() => TREE_DATA, []);

  return (
    <>
      <ISection>
        <ISectionHeader>Grid</ISectionHeader>
        <ISectionBody>
          <IGrid<UserRow>
            selectionMode="multiple"
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
              cellDef={(row: any) => (
                <div className="font-semibold">{row.name}</div>
              )}
            />

            <IGridColumn<UserRow>
              fieldName="email"
              title="Email"
              width={260}
              cellDef={(row: any) => (
                <span className="text-subtle truncate">{row.email}</span>
              )}
            />

            <IGridColumn<UserRow> fieldName="role" title="Role" width={160} />

            <IGridCustomColumn<UserRow>
              title="Actions"
              width={220}
              cellDef={(row: any) => (
                <div className="flex gap-sm">
                  <IButton
                    size="xs"
                    variant="outline"
                    onClick={() => console.log('edit', row)}>
                    Edit
                  </IButton>
                  <IButton
                    size="xs"
                    variant="outline"
                    onClick={() => console.log('delete', row)}>
                    Delete
                  </IButton>
                </div>
              )}
            />

            <IGridExpandableRow<UserRow>
              render={(row) => (
                <div className="flex flex-col gap-md p-md">
                  <div>
                    <b>ID:</b> {row.id}
                  </div>
                  <div>
                    <b>Department:</b> {row.department}
                  </div>
                  <div>
                    <b>Status:</b> {row.status}
                  </div>
                </div>
              )}
            />
          </IGrid>
        </ISectionBody>
      </ISection>
      <br />
      <ISection>
        <ISectionHeader>Grid With Column Grouping</ISectionHeader>
        <ISectionBody>
          <IGrid<UserRow>
            selectionMode="multiple"
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
              cellDef={(row: any) => (
                <div className="font-semibold">{row.name}</div>
              )}
            />

            <IGridColumnGroup title={'Identity'}>
              <IGridColumn<UserRow>
                fieldName="email"
                title="Email"
                width={260}
                cellDef={(row: any) => (
                  <span className="text-subtle truncate">{row.email}</span>
                )}
              />
              <IGridColumn<UserRow> fieldName="role" title="Role" width={160} />
            </IGridColumnGroup>

            <IGridCustomColumn<UserRow>
              title="Actions"
              width={220}
              cellDef={(row: any) => (
                <div className="flex gap-sm">
                  <IButton
                    size="xs"
                    variant="outline"
                    onClick={() => console.log('edit', row)}>
                    Edit
                  </IButton>
                  <IButton
                    size="xs"
                    variant="outline"
                    onClick={() => console.log('delete', row)}>
                    Delete
                  </IButton>
                </div>
              )}
            />

            <IGridExpandableRow<UserRow>
              render={(row) => (
                <div className="flex flex-col gap-md p-md">
                  <div>
                    <b>ID:</b> {row.id}
                  </div>
                  <div>
                    <b>Department:</b> {row.department}
                  </div>
                  <div>
                    <b>Status:</b> {row.status}
                  </div>
                </div>
              )}
            />
          </IGrid>
        </ISectionBody>
      </ISection>
      <br></br>
      <ISection>
        <ISectionHeader>Grid with Tree Mode</ISectionHeader>
        <ISectionBody>
          <IGrid<TreeNode>
            selectionMode="multiple"
            dataSource={treeDataSource}
            // Angular: [tree]="'children'"
            tree="children"
            // Angular: [treeInitialExpandLevel]="2"
            treeInitialExpandLevel={2}
            // Angular: [showNumberColumn]="false"
            showNumberColumn={false}
            // optional: stable key is important for tree selection/expanded state
            rowKey={(row) => row.id}
            onSelectionChange={(payload) =>
              console.log('rowSelectionChange', payload)
            }
            onRowClick={(row) => console.log('rowClick', row)}
            onRowExpandChange={(ev) => console.log('rowExpandChange', ev)}
            onExpandedRowsChange={(rows) =>
              console.log('expandedRowsChange', rows)
            }>
            {/* Name column (frozen + fill width) */}
            <IGridColumn<TreeNode>
              fieldName="name"
              title="Name"
              width="fill"
              freeze
            />

            {/* Status column */}
            <IGridColumn<TreeNode>
              fieldName="status"
              title="Status"
              width={140}
            />
          </IGrid>
        </ISectionBody>
      </ISection>
    </>
  );
}
