import { useRef, useState } from 'react';
import {
  IBanner,
  IButton,
  IImageCropper,
  type IImageCropperHandle,
} from '../../components';
export function ImageCropperDemo() {
  const cropper = useRef<IImageCropperHandle>(null);
  const [ready, setReady] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [exported, setExported] = useState('');
  const [error, setError] = useState('');
  const image =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="480" height="320" fill="#e0f2fe"/><circle cx="240" cy="160" r="100" fill="#2563eb"/></svg>'
    );
  const exportImage = async (mimeType: 'image/png' | 'image/jpeg') => {
    try {
      const result = await cropper.current!.exportImage({ mimeType });
      setExported(result.dataUrl);
      setError('');
    } catch {
      setError('Unable to export image.');
    }
  };
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Image Cropper</h1>
      <p>
        Drag to pan, use arrow keys to reposition, and adjust zoom. The circle
        is a preview mask; exports remain square.
      </p>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />{' '}
        Disable Interaction
      </label>
      <IImageCropper
        ref={cropper}
        shape="circle"
        src={image}
        disabled={disabled}
        onReady={() => setReady(true)}
        onError={() => setError('Unable to load image.')}
      />
      <div className="flex gap-md">
        <IButton
          disabled={!ready}
          onClick={() => {
            void exportImage('image/png');
          }}>
          Export PNG
        </IButton>
        <IButton
          disabled={!ready}
          onClick={() => {
            void exportImage('image/jpeg');
          }}>
          Export JPEG
        </IButton>
      </div>
      <IBanner variant="danger" message={error} />
      {exported ? <img alt="Exported crop" width="160" src={exported} /> : null}
    </div>
  );
}
