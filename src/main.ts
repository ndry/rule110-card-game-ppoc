import {adjust, getRandomElement, setPixel} from "./utils/misc";
import {CellValue, simulateSteps, step} from "./physics";
import {renderSteps} from "./graphics";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

ctx.imageSmoothingEnabled = false;

const cardAmount = 4;
const deckSize = 10;
const cardLength = 80;
const gameSteps = 2000;
const cardPreviewSteps = 240;

let board = Array.from({length: cardAmount * cardLength}, () => Math.round(Math.random()));

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
              board[i * cardLength + x] = state[x];
            }

            renderBoard();
          });
        }));
      }
    });

  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;


  return {
    state: state,
    ctx: ctx!,
  }
});

function renderBoard() {
  renderSteps(ctx, simulateSteps(board, gameSteps));
}

function render() {
  renderBoard();

  for (let i = 0; i < deckSize; i++) {
    renderSteps(deck[i].ctx, simulateSteps(deck[i].state, cardPreviewSteps));
  }
}


render();
