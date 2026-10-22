import { fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IImageCropper } from './image-cropper';
import { ImageCropperEngine } from './image-cropper-engine';
describe('IImageCropper interaction', () => {
  afterEach(() => vi.restoreAllMocks());
  it('supports keyboard panning and disables interaction while saving', async () => {
    vi.spyOn(ImageCropperEngine.prototype, 'load').mockImplementation(
      async function (this: ImageCropperEngine) {
        const image = document.createElement('img');
        Object.defineProperties(image, {
          naturalWidth: { value: 400 },
          naturalHeight: { value: 300 },
        });
        this.image = image;
        return true;
      }
    );
    const pan = vi.spyOn(ImageCropperEngine.prototype, 'panBy'),
      ready = vi.fn();
    const { container, rerender } = render(
      <IImageCropper src="blob:fixture" onReady={ready} />
    );
    await waitFor(() =>
      expect(
        (container.querySelector('input') as HTMLInputElement).disabled
      ).toBe(false)
    );
    expect(ready).toHaveBeenCalledOnce();
    const stage = container.querySelector('[role="group"]')!;
    fireEvent.keyDown(stage, { key: 'ArrowRight' });
    expect(pan).toHaveBeenCalledWith(5, 0);
    rerender(<IImageCropper src="blob:fixture" disabled />);
    fireEvent.keyDown(stage, { key: 'ArrowLeft' });
    expect(pan).toHaveBeenCalledTimes(1);
    expect(
      (container.querySelector('input') as HTMLInputElement).disabled
    ).toBe(true);
    expect(stage.getAttribute('tabindex')).toBe('-1');
  });
});
