export class Vector2 {

constructor(x = 0, y = 0) {

    this.x = x;
    this.y = y;
}


set(x, y) {

    this.x = x;
    this.y = y;

    return this;
}


copy() {

    return new Vector2(
        this.x,
        this.y
    );
}


length() {

    return Math.sqrt(
        this.x * this.x +
        this.y * this.y
    );
}


normalize() {

    const length = this.length();

    if (length === 0) {
        return this;
    }

    this.x /= length;
    this.y /= length;

    return this;
}


multiply(value) {

    this.x *= value;
    this.y *= value;

    return this;
}


add(vector) {

    this.x += vector.x;
    this.y += vector.y;

    return this;
}


}