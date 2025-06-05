import { Vec2 } from "../utils/math";

export interface Sprite {
    pos: Vec2;
    z: number;
    w: number;
    h: number;
    asset: string;
    zAnchor: number;
    bob(dt: number): void;
}

export const defaultSprites: Array<Sprite> = [
    // Add placeholder sprites here if needed, or leave empty for now
    // Example: { pos: new Vec2(5, 5), z: 0.5, w: 1, h: 1, asset: 'texture_key', zAnchor: 0 },
];

export const assetType = {}; // Placeholder if needed by other files

export const makeTextCanvas = (text: string, w: number, h: number): HTMLCanvasElement | OffscreenCanvas => {
    // Placeholder function, actual implementation would create a canvas with text
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(text, 10, 30);
    }
    return canvas;
}; 