import {adjust, getRandomElement, setPixel} from "./utils/misc";
import {CellValue, simulateSteps, step} from "./physics";
import {renderSteps} from "./graphics";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

ctx.imageSmoothingEnabled = false;

const previewTailCanvas = document.getElementById("previewTail-canvas") as HTMLCanvasElement;
const previewTailCtx = previewTailCanvas.getContext("2d")!;

previewTailCanvas.width = previewTailCanvas.clientWidth;
previewTailCanvas.height = previewTailCanvas.clientHeight;

previewTailCtx.imageSmoothingEnabled = false;

const texture = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1];

const cardAmount = 4;
const deckSize = 10;
const cardLength = texture.length * 6;
const gameSteps = 5000;
const cardPreviewSteps = cardLength * 5;
const boardSize = cardLength * 20;

let board = Array.from({length: boardSize}, (v, k) => texture[k % texture.length]);

interface Card {
  state: CellValue[],
  ctx: CanvasRenderingContext2D
}

const deckContainer = document.getElementById("deck") as HTMLDivElement;

const deck = Array.from({length: deckSize}, () => {
  let state = Array.from({length: cardLength}, () => Math.round(Math.random()));
  let ctx: CanvasRenderingContext2D | undefined = undefined;
  deckContainer.appendChild(adjust(
    document.createElement("div"), div => {
      div.classList.add("card");
      const canvas = document.createElement("canvas");
      div.appendChild(canvas);
      ctx = canvas.getContext("2d")!;

      for (let i = 0; i < cardAmount; i++) {
        div.appendChild(adjust(document.createElement("input"), r => {
          r.type = "radio";
          r.classList.add(`card-place-radio-${i}`);
          r.name = `card-place-radio-${i}`;
          r.value = `${i}`;

          r.addEventListener("click", ev => {
            if (!r.checked) {
              return;
            }

            for (let x = 0; x < state.length; x++) {
              board[(i * 5 + 2) * cardLength + x] = state[x];
            }

            renderBoard();
          });
        }));
      }
    });

  ctx!.canvas.width = ctx!.canvas.clientWidth;
  ctx!.canvas.height = ctx!.canvas.clientHeight;


  return {
    state: state,
    ctx: ctx!,
  }
});

function renderBoard() {
  renderSteps(ctx, simulateSteps(board, gameSteps));
  previewTailCtx.drawImage(canvas,
    0, gameSteps - previewTailCanvas.height, previewTailCanvas.width, previewTailCanvas.height,
    0, 0, previewTailCanvas.width, previewTailCanvas.height);
}

function render() {
  renderBoard();

  for (const card of deck) {
    const previewSpace = Array.from({length: cardLength * 5}, (v, k) => texture[k % texture.length]);
    for (let x = 0; x < card.state.length; x++) {
      previewSpace[cardLength * 2 + x] = card.state[x];
    }
    renderSteps(
      card.ctx,
      simulateSteps(
        previewSpace,
        cardPreviewSteps));
  }
}


render();
