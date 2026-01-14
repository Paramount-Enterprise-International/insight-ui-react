import { IButton } from '../../components/button';

export function GridTree() {
  return (
    <div className="p-md flex flex-col gap-md">
      <h1>Playground 2</h1>
      <IButton onClick={() => console.log('hello from playground2')}>
        Hello World
      </IButton>
    </div>
  );
}
