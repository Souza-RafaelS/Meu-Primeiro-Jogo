export class Collider {

constructor(
    x = 0,
    y = 0,
    width = 32,
    height = 32
) {

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.enabled = true;
}


// ========================================
// RETÂNGULO NO MUNDO
// ========================================

getRect(entity) {

    return {

        x:
            entity.transform.x +
            this.x,

        y:
            entity.transform.y +
            this.y,

        width:
            this.width,

        height:
            this.height
    };
}


// ========================================
// CENTRO
// ========================================

getCenter(entity) {

    const rect =
        this.getRect(entity);


    return {

        x:
            rect.x +
            rect.width / 2,

        y:
            rect.y +
            rect.height / 2
    };
}


}