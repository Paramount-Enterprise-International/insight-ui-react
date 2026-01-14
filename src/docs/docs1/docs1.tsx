import { IButton } from '../../components/button';

export function Docs1Page() {
  return (
    <div className="p-md flex flex-col gap-md">
      <h1>Docs 1</h1>
      <IButton onClick={() => console.log('hello from docs1')}>
        Hello World
      </IButton>
    </div>
  );
}
