import { IButton } from '../../components/button';

export function Docs2Page() {
  return (
    <div className="p-md flex flex-col gap-md">
      <h1>Docs 2</h1>
      <IButton onClick={() => console.log('hello from docs2')}>
        Hello World
      </IButton>
    </div>
  );
}
