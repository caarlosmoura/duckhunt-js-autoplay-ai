// layout.js
import * as PIXI from 'pixi.js';

export function buildLayout(app, gameStage) {
    // Container for HUD
    const hud = new PIXI.Container();
    hud.y = 50;
    hud.zIndex = 1000;

    // Score Text
    const scoreText = new PIXI.Text({
        text: 'Score: 0',
        style: {
            fontFamily: 'monospace',
            fontSize: 24,
            fill: 0xffffff,
            stroke: 0x000000,
        }
    });
    hud.addChild(scoreText);

    // Predictions Text
    const predictionsText = new PIXI.Text({
        text: 'Predictions:',
        style: {
            fontFamily: 'monospace',
            fontSize: 16,
            fill: 0xfff666,
            stroke: 0x333300,
            wordWrap: true,
            wordWrapWidth: 420,
        }
    });
    predictionsText.y = 36;
    hud.addChild(predictionsText);

    const detectionOverlay = new PIXI.Graphics();
    detectionOverlay.zIndex = 999;

    // Add HUD to stage, ensure it's always on top
    app.stage.sortableChildren = true;
    gameStage.sortableChildren = true;
    gameStage.addChild(detectionOverlay);
    app.stage.addChild(hud);

    // Function to reposition HUD at top-right
    function positionHUD() {
        // Margin from the right
        const margin = 16;
        // Find HUD width (in case text wraps/grows)
        const hudWidth = Math.max(scoreText.width, predictionsText.width);
        hud.x = app.renderer.width - hudWidth - margin;
    }

    // Utility for updating HUD
    function updateHUD(data) {
        scoreText.text = `Confidence: ${data.score}%`;
        predictionsText.text = `${data.label}: (${Math.round(data.x)}, ${Math.round(data.y)})`;
        positionHUD();
    }

    function drawDetection(data) {
        detectionOverlay.clear();
        detectionOverlay
            .rect(data.x1, data.y1, data.width, data.height)
            .stroke({
                width: 3,
                color: 0x54f073
            });
    }

    function clearDetection() {
        detectionOverlay.clear();
    }

    // Position HUD initially and on every resize
    positionHUD();
    window.addEventListener('resize', () => {
        positionHUD();
    });

    return {
        clearDetection,
        drawDetection,
        updateHUD,
    };
}
