import { buildLayout } from "./layout";

export default async function main(game) {
    const container = buildLayout(game.app, game.stage);
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    const detectionHoldMs = 400;
    const aimTarget = {
        x: game.stage.aim.position.x,
        y: game.stage.aim.position.y,
    };
    const smoothing = 0.2;
    let lastDetectionAt = 0;

    game.stage.aim.visible = true;
    game.stage.aim.setPosition(aimTarget.x, aimTarget.y);

    game.app.ticker.add(() => {
        if (!game.stage.aim.visible) {
            return;
        }

        const nextX = game.stage.aim.position.x + ((aimTarget.x - game.stage.aim.position.x) * smoothing);
        const nextY = game.stage.aim.position.y + ((aimTarget.y - game.stage.aim.position.y) * smoothing);
        game.stage.aim.setPosition(nextX, nextY);
    });

    worker.onmessage = ({ data }) => {
        const { type, x, y } = data;

        if (type === 'prediction') {
            console.log(`AI predicted at: (${x}, ${y})`);
            lastDetectionAt = Date.now();
            container.updateHUD(data);
            container.drawDetection(data);
            game.stage.aim.visible = true;
            aimTarget.x = data.x;
            aimTarget.y = data.y;
            game.handleAiShot(data);
            return;
        }

        if (type === 'no-prediction') {
            if (Date.now() - lastDetectionAt > detectionHoldMs) {
                container.clearDetection();
            }
        }
    };

    worker.onerror = (error) => {
        console.error('AI worker failed:', error);
    };

    setInterval(async () => {
        const canvas = game.app.renderer.extract.canvas(game.stage);
        const bitmap = await createImageBitmap(canvas);

        worker.postMessage({
            type: 'predict',
            image: bitmap,
        }, [bitmap]);

    }, 200);

    return container;
}
