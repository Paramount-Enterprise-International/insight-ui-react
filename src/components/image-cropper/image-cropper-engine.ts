export type IImageCropperExportOptions = {
  mimeType?: 'image/png' | 'image/jpeg';
  quality?: number;
};
export type IImageCropperResult = {
  blob: Blob;
  dataUrl: string;
  mimeType: string;
  width: number;
  height: number;
};
export type IImageCropRect = {
  srcX: number;
  srcY: number;
  srcW: number;
  srcH: number;
};
export function computeCropRect(
  naturalWidth: number,
  naturalHeight: number,
  zoom: number,
  panX: number,
  panY: number,
  stage: number
): IImageCropRect | null {
  if (naturalWidth <= 0 || naturalHeight <= 0 || stage <= 0 || zoom < 1)
    return null;
  const scale = Math.max(stage / naturalWidth, stage / naturalHeight) * zoom;
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const x = Math.min(Math.max(panX, -(width - stage) / 2), (width - stage) / 2);
  const y = Math.min(
    Math.max(panY, -(height - stage) / 2),
    (height - stage) / 2
  );
  const srcW = stage / scale;
  const srcH = stage / scale;
  return {
    srcX: Math.min(
      Math.max(((width - stage) / 2 - x) / scale, 0),
      Math.max(0, naturalWidth - srcW)
    ),
    srcY: Math.min(
      Math.max(((height - stage) / 2 - y) / scale, 0),
      Math.max(0, naturalHeight - srcH)
    ),
    srcW,
    srcH,
  };
}
export class ImageCropperEngine {
  image: HTMLImageElement | null = null;
  zoom = 1;
  panX = 0;
  panY = 0;
  size = 240;
  minZoom = 1;
  maxZoom = 3;
  private version = 0;
  async load(src: string | null | undefined): Promise<boolean> {
    const version = ++this.version;
    this.image = null;
    this.zoom = this.minZoom;
    this.panX = 0;
    this.panY = 0;
    if (!src) return false;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = (): void => {
        if (version !== this.version) {
          resolve(false);
          return;
        }
        if (!image.naturalWidth || !image.naturalHeight) {
          reject(new Error('Unable to load image.'));
          return;
        }
        this.image = image;
        this.clampPan();
        resolve(true);
      };
      image.onerror = (): void => {
        if (version !== this.version) {
          resolve(false);
          return;
        }
        reject(new Error('Unable to load image.'));
      };
      image.src = src;
    });
  }
  configure(size: number, minZoom: number, maxZoom: number): void {
    this.size = Number.isFinite(size) && size > 0 ? size : 240;
    this.minZoom = Number.isFinite(minZoom) ? Math.max(1, minZoom) : 1;
    this.maxZoom = Number.isFinite(maxZoom)
      ? Math.max(this.minZoom, maxZoom)
      : Math.max(this.minZoom, 3);
    this.setZoom(this.zoom);
  }
  setZoom(value: number): void {
    if (!Number.isFinite(value)) return;
    this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, value));
    this.clampPan();
  }
  panBy(x: number, y: number): void {
    this.panX += x;
    this.panY += y;
    this.clampPan();
  }
  private clampPan(): void {
    const image = this.image;
    if (!image) return;
    const scale =
      Math.max(
        this.size / image.naturalWidth,
        this.size / image.naturalHeight
      ) * this.zoom;
    const x = Math.max(0, (image.naturalWidth * scale - this.size) / 2);
    const y = Math.max(0, (image.naturalHeight * scale - this.size) / 2);
    this.panX = Math.min(x, Math.max(-x, this.panX));
    this.panY = Math.min(y, Math.max(-y, this.panY));
  }
  get imageStyle(): {
    width: string;
    height: string;
    left: string;
    top: string;
  } | null {
    const image = this.image;
    if (!image) return null;
    const scale =
      Math.max(
        this.size / image.naturalWidth,
        this.size / image.naturalHeight
      ) * this.zoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${(this.size - width) / 2 + this.panX}px`,
      top: `${(this.size - height) / 2 + this.panY}px`,
    };
  }
  async exportImage(
    options: IImageCropperExportOptions = {}
  ): Promise<IImageCropperResult> {
    const image = this.image;
    const version = this.version;
    if (!image) throw new Error('Load an image before exporting.');
    const rect = computeCropRect(
      image.naturalWidth,
      image.naturalHeight,
      this.zoom,
      this.panX,
      this.panY,
      this.size
    );
    if (!rect) throw new Error('Unable to crop image.');
    const size = Math.max(1, Math.floor(Math.min(rect.srcW, rect.srcH)));
    const canvas = image.ownerDocument.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Unable to create image canvas.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(
      image,
      rect.srcX,
      rect.srcY,
      rect.srcW,
      rect.srcH,
      0,
      0,
      size,
      size
    );
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value ? resolve(value) : reject(new Error('Unable to export image.')),
        options.mimeType ?? 'image/png',
        options.quality ?? 1
      )
    );
    if (version !== this.version)
      throw new DOMException('The image source changed.', 'AbortError');
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void =>
        typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error('Unable to read exported image.'));
      reader.onerror = (): void =>
        reject(new Error('Unable to read exported image.'));
      reader.onabort = (): void =>
        reject(new DOMException('Image export was aborted.', 'AbortError'));
      reader.readAsDataURL(blob);
    });
    if (version !== this.version)
      throw new DOMException('The image source changed.', 'AbortError');
    return { blob, dataUrl, mimeType: blob.type, width: size, height: size };
  }
  dispose(): void {
    ++this.version;
    this.image = null;
  }
}
