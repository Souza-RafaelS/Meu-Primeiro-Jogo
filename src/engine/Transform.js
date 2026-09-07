export class Transform {

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
}


getCenterX() {

    return (
        this.x +
        this.width / 2
    );
}


getCenterY() {

    return (
        this.y +
        this.height / 2
    );
}


}