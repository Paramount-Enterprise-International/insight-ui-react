import { useState } from 'react';
import {
  IActionPlaceholder,
  IButton,
  type IButtonSize,
} from '../../components';
export function ActionPlaceholderDemo() {
  const sizes: IButtonSize[] = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg'];
  const [size, setSize] = useState<IButtonSize>('xs');
  const [placeholder, setPlaceholder] = useState(false);
  const [clicks, setClicks] = useState(0);
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Action Placeholder</h1>
      <label>
        Size{' '}
        <select
          value={size}
          onChange={(event) => setSize(event.target.value as IButtonSize)}>
          {sizes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <IButton onClick={() => setPlaceholder(!placeholder)}>
        Toggle Placeholder
      </IButton>
      <div className="flex align-center gap-md">
        <IButton
          icon="edit"
          size={size}
          placeholder={placeholder}
          onClick={() => setClicks(clicks + 1)}
        />
        <IActionPlaceholder size={size} />
        <span>Clicks: {clicks}</span>
      </div>
      {sizes.map((value) => (
        <div className="flex align-center gap-md" key={value}>
          <span>{value}</span>
          <IButton icon="edit" size={value} />
          <IActionPlaceholder size={value} />
        </div>
      ))}
    </div>
  );
}
