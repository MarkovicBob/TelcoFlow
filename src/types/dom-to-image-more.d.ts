declare module "dom-to-image-more" {
  interface DomToImageOptions {
    cacheBust?: boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    quality?: number;
    pixelRatio?: number;
    imagePlaceholder?: string;
    canvasWidth?: number;
    canvasHeight?: number;
  }

  export function toPng(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;

  export function toJpeg(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;

  export function toBlob(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<Blob>;

  export function toSvg(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;
}
