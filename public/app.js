System.register("physics", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function step(current) {
        const next = Array.from({ length: current.length }, () => 0);
        for (let i = 0; i < current.length; i++) {
            const l = (current.length + i - 1) % current.length;
            const r = (i + 1) % current.length;
            next[i] = rule[current[l]][current[i]][current[r]];
        }
        return next;
    }
    exports_1("step", step);
    function simulateSteps(state, steps) {
        const result = [state];
        for (let i = 0; i < steps; i++) {
            result.push(step(result[result.length - 1]));
        }
        return result;
    }
    exports_1("simulateSteps", simulateSteps);
    var rule;
    return {
        setters: [],
        execute: function () {
            rule = [[[
                        0, 1
                    ], [
                        1, 1
                    ]], [[
                        0, 1
                    ], [
                        1, 0
                    ]]];
        }
    };
});
System.register("utils/misc", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_2("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_2("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_2("getRandomElement", getRandomElement);
    function setPixel(imageData, x, y, r, g, b, a = 255) {
        const offset = (y * imageData.width + x) * 4;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_2("setPixel", setPixel);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("graphics", ["utils/misc"], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function renderSteps(ctx, steps) {
        const imageData = ctx.createImageData(steps[0].length, steps.length);
        for (let t = 0; t < steps.length; t++) {
            const space = steps[t];
            for (let x = 0; x < space.length; x++) {
                const v = space[x];
                setPixel1(imageData, x, t, v);
            }
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.drawImage(ctx.canvas, 0, 0, imageData.width, imageData.height, 0, 0, imageData.width * cellSize, imageData.height * cellSize);
    }
    exports_3("renderSteps", renderSteps);
    function setPixel1(imageData, x, y, value) {
        if (value) {
            misc_1.setPixel(imageData, x, y, 0x00, 0xFF, 0x00);
        }
        else {
            misc_1.setPixel(imageData, x, y, 0x00, 0x00, 0x00);
        }
    }
    exports_3("setPixel1", setPixel1);
    var misc_1, cellSize;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            }
        ],
        execute: function () {
            exports_3("cellSize", cellSize = 1);
        }
    };
});
System.register("main", ["utils/misc", "physics", "graphics"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function renderBoard() {
        graphics_1.renderSteps(ctx, physics_1.simulateSteps(board, gameSteps));
        previewTailCtx.drawImage(canvas, 0, gameSteps - previewTailCanvas.height, previewTailCanvas.width, previewTailCanvas.height, 0, 0, previewTailCanvas.width, previewTailCanvas.height);
    }
    function render() {
        renderBoard();
        for (const card of deck) {
            const previewSpace = Array.from({ length: cardLength * 5 }, (v, k) => texture[k % texture.length]);
            for (let x = 0; x < card.state.length; x++) {
                previewSpace[cardLength * 2 + x] = card.state[x];
            }
            graphics_1.renderSteps(card.ctx, physics_1.simulateSteps(previewSpace, cardPreviewSteps));
        }
    }
    var misc_2, physics_1, graphics_1, canvas, ctx, previewTailCanvas, previewTailCtx, texture, cardAmount, deckSize, cardLength, gameSteps, cardPreviewSteps, boardSize, board, deckContainer, deck;
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (physics_1_1) {
                physics_1 = physics_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.imageSmoothingEnabled = false;
            previewTailCanvas = document.getElementById("previewTail-canvas");
            previewTailCtx = previewTailCanvas.getContext("2d");
            previewTailCanvas.width = previewTailCanvas.clientWidth;
            previewTailCanvas.height = previewTailCanvas.clientHeight;
            previewTailCtx.imageSmoothingEnabled = false;
            texture = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1];
            cardAmount = 4;
            deckSize = 10;
            cardLength = texture.length * 6;
            gameSteps = 5000;
            cardPreviewSteps = cardLength * 5;
            boardSize = cardLength * 20;
            board = Array.from({ length: boardSize }, (v, k) => texture[k % texture.length]);
            deckContainer = document.getElementById("deck");
            deck = Array.from({ length: deckSize }, () => {
                let state = Array.from({ length: cardLength }, () => Math.round(Math.random()));
                let ctx = undefined;
                deckContainer.appendChild(misc_2.adjust(document.createElement("div"), div => {
                    div.classList.add("card");
                    const canvas = document.createElement("canvas");
                    div.appendChild(canvas);
                    ctx = canvas.getContext("2d");
                    for (let i = 0; i < cardAmount; i++) {
                        div.appendChild(misc_2.adjust(document.createElement("input"), r => {
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
                }));
                ctx.canvas.width = ctx.canvas.clientWidth;
                ctx.canvas.height = ctx.canvas.clientHeight;
                return {
                    state: state,
                    ctx: ctx,
                };
            });
            render();
        }
    };
});
//# sourceMappingURL=app.js.map