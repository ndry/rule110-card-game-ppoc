import {CellValue} from "./physics";
import {setPixel} from "./utils/misc";

export const cellSize = 1;

export function renderSteps(ctx: CanvasRenderingContext2D, steps: CellValue[][]) {
  const imageData = ctx.createImageData(steps[0].length, steps.length);

  for (let t = 0; t < steps.length; t++) {
    const space = steps[t];
    for (let x = 0; x < space.length; x++) {
      const v = space[x];
      setPixel1(imageData, x, t, v);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.drawImage(ctx.canvas,
    0, 0, imageData.width, imageData.height,
    0, 0, imageData.width * cellSize, imageData.height * cellSize);
}

export function setPixel1(imageData: ImageData, x: number, y: number, value: CellValue) {
  if (value) {
    setPixel(imageData, x, y, 0x00, 0xFF, 0x00);
  } else {
    setPixel(imageData, x, y, 0x00, 0x00, 0x00);
  }
}
