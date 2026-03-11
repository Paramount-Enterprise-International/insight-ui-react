import { IDialog, useDialogRef } from '../../../components';

export function CreateRequest() {
  const dialogRef = useDialogRef<boolean>();

  const handleSave = () => {
    dialogRef.close(true);
  };

  return (
    <IDialog
      title="Test Dialog"
      actions={[
        { type: 'save', className: 'w-32' },
        { type: 'cancel', className: 'w-32' },
      ]}
      onSave={handleSave}>
      <div className="p-4">
        <h4 className="mb-4">This is a test dialog</h4>
        <p className="mt-4 text-sm text-gray-500">
          Dialog is working if you can see this!
        </p>
      </div>
    </IDialog>
  );
}
