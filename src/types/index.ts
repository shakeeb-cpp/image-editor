export interface ImageState {
  publicId: string | null;
  originalUrl: string | null;
  transformedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface AdjustmentState {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  hue: number;
  sharpness: number;
  unsharpMask: number;
  vignette: number;
  ambiance: number;
  highlight: number;
}

export interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  position: 'top' | 'center' | 'bottom' | null;
}

export interface RotationState {
  angle: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface FilterState {
  grayscale: boolean;
  sepia: boolean;
  blur: number;
  vignette: boolean;
  colorize: number;
  blackAndWhite: boolean;
  redEye: boolean;
  negate: boolean;
  oilPaint: number;
  simulateColorBlind: string; // 'deuteranopia' | 'protanopia' | 'tritanopia' | 'none'
  pixelate: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface ImageOverlay {
  id: string;
  publicId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export interface OverlayState {
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
}

export interface HistoryState {
  past: any[];
  present: any;
  future: any[];
  canUndo: boolean;
  canRedo: boolean;
}

export interface Transformation {
  type: "adjustment" | "crop" | "rotation" | "filter" | "overlay";
  data: any;
  timestamp: number;
}
