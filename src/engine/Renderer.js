export class Renderer {

constructor(canvas, width = 500, height = 500) {

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;


    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;

    this.camera = null;
}


// ========================================
// CAMERA
// ========================================

setCamera(camera) {

    this.camera = camera;
}


// ========================================
// CLEAR
// ========================================

clear() {

    this.context.clearRect(
        0,
        0,
        this.width,
        this.height
    );
}


// ========================================
// POSIÇÃO NA TELA
// ========================================

getScreenPosition(
    x,
    y
) {

    const cameraX =
        this.camera
            ? this.camera.x
            : 0;


    const cameraY =
        this.camera
            ? this.camera.y
            : 0;


    const zoom =
        this.camera &&
        this.camera.zoom
            ? this.camera.zoom
            : 1;


    return {

        x:
            (x - cameraX) *
            zoom,

        y:
            (y - cameraY) *
            zoom
    };
}


// ========================================
// RECT
// ========================================

fillRect(
    x,
    y,
    width,
    height,
    color
) {

    this.context.fillStyle =
        color;


    const position =
        this.getScreenPosition(
            x,
            y
        );


    const zoom =
        this.camera &&
        this.camera.zoom
            ? this.camera.zoom
            : 1;


    this.context.fillRect(

        position.x,

        position.y,

        width * zoom,

        height * zoom
    );
}


// ========================================
// SCREEN
// ========================================

fillScreen(color) {

    this.context.fillStyle =
        color;


    this.context.fillRect(
        0,
        0,
        this.width,
        this.height
    );
}
drawImageFrame(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
) {

    const position =
        this.getScreenPosition(
            x,
            y
        );


    const zoom =
        this.camera &&
        this.camera.zoom
            ? this.camera.zoom
            : 1;
    
    this.context.imageSmoothingEnabled = false;


    this.context.drawImage(

        image,

        sourceX,
        sourceY,

        sourceWidth,
        sourceHeight,

        position.x,
        position.y,

        width * zoom,
        height * zoom
    );
}

// ========================================
// TEXT
// ========================================

drawText(
    text,
    x,
    y,
    color = "#ffffff",
    font = "20px Arial",
    align = "center",
    alpha = 1
) {

    this.context.save();

    this.context.globalAlpha = alpha;

    this.context.fillStyle = color;
    this.context.font = font;
    this.context.textAlign = align;
    this.context.textBaseline = "middle";

    this.context.fillText(
        text,
        x,
        y
    );

    this.context.restore();
}


}