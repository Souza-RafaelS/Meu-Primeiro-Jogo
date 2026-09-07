export class EntityManager {

constructor() {

    this.entities = [];
}


add(entity) {

    this.entities.push(entity);

    return entity;
}


remove(entity) {

    const index = this.entities.indexOf(entity);

    if (index !== -1) {
        this.entities.splice(index, 1);
    }
}


update(delta) {

    for (const entity of this.entities) {

        if (!entity.active) {
            continue;
        }

        entity.update(delta);
    }
}


render(renderer) {

    for (const entity of this.entities) {

        if (!entity.active) {
            continue;
        }

        entity.render(renderer);
    }
}


clear() {

    this.entities.length = 0;
}


}