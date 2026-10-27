import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageCropperEngine, computeCropRect } from './image-cropper-engine';
describe('ImageCropperEngine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  function prepare(
    width = 400,
    height = 300,
    blob = new Blob(['crop'], { type: 'image/png' })
  ) {
    const engine = new ImageCropperEngine(),
      image = document.createElement('img');
    Object.defineProperties(image, {
      naturalWidth: { value: width },
      naturalHeight: { value: height },
    });
    engine.image = image;
    const canvas = document.createElement('canvas');
    const draw = vi.fn();
    const context = {
      drawImage: draw,
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    };
    const getContext = vi.spyOn(canvas, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    );
    const toBlob = vi.spyOn(canvas, 'toBlob').mockImplementation(
      (callback: BlobCallback) => callback(blob)
    );
    const original = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) =>
      tag === 'canvas'
        ? canvas
        : original(tag)) as typeof document.createElement);
    return { engine, canvas, draw, getContext, toBlob, blob };
  }
  it('clamps the crop to image bounds', () => {
    const rect = computeCropRect(4000, 3000, 2, 99999, -99999, 240)!;
    expect(rect.srcX).toBeGreaterThanOrEqual(0);
    expect(rect.srcY).toBeGreaterThanOrEqual(0);
    expect(rect.srcX + rect.srcW).toBeLessThanOrEqual(4000);
    expect(rect.srcY + rect.srcH).toBeLessThanOrEqual(3000);
    expect(computeCropRect(0, 0, 1, 0, 0, 240)).toBeNull();
  });
  it('exports original crop resolution with preview derived from the exported blob', async () => {
    const { engine, canvas, blob } = prepare(4000, 3000);
    const result = await engine.exportImage();
    expect(canvas.width).toBe(3000);
    expect(canvas.height).toBe(3000);
    expect(result.blob).toBe(blob);
    expect(result.mimeType).toBe('image/png');
    expect(result.dataUrl).toContain('data:image/png;base64,');
  });
  it('exports the selected zoom and pan without upscaling', async () => {
    const { engine, canvas, draw } = prepare(90, 60);
    engine.setZoom(3);
    engine.panBy(30, -20);
    const rect = computeCropRect(90, 60, 3, engine.panX, engine.panY, 240)!;
    await engine.exportImage({ mimeType: 'image/jpeg', quality: 1 });
    expect(canvas.width).toBe(20);
    expect(canvas.height).toBe(20);
    expect(draw).toHaveBeenCalledWith(
      engine.image,
      rect.srcX,
      rect.srcY,
      rect.srcW,
      rect.srcH,
      0,
      0,
      20,
      20
    );
  });
  it('rejects missing canvas support', async () => {
    const { engine, getContext } = prepare();
    getContext.mockReturnValue(null);
    await expect(engine.exportImage()).rejects.toThrow();
  });
  it('rejects null exports', async () => {
    const { engine, toBlob } = prepare();
    toBlob.mockImplementation((callback: BlobCallback) => callback(null));
    await expect(engine.exportImage()).rejects.toThrow();
  });
  it('invalidates an export when destroyed or replaced', async () => {
    const { engine, toBlob, blob } = prepare();
    let finish!: BlobCallback;
    toBlob.mockImplementation((callback: BlobCallback) => {
      finish = callback;
    });
    const pending = engine.exportImage();
    engine.dispose();
    finish(blob);
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('clamps zoom and panning', () => {
    const { engine } = prepare();
    engine.setZoom(100);
    expect(engine.zoom).toBe(3);
    engine.setZoom(-100);
    expect(engine.zoom).toBe(1);
    engine.panBy(999999, 999999);
    const rect = computeCropRect(
      400,
      300,
      engine.zoom,
      engine.panX,
      engine.panY,
      240
    )!;
    expect(rect.srcX + rect.srcW).toBeLessThanOrEqual(400);
    expect(rect.srcY + rect.srcH).toBeLessThanOrEqual(300);
  });
});
