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
    // Percorre a lista de trás para frente (da última posição para a primeira).
    // Isso evita problemas de pulo de índices ao remover itens com splice dentro do loop.
    for (let i = this.entities.length - 1; i >= 0; i--) {
        const entity = this.entities[i];

        // Se a entidade foi desativada (ex: morreu), removemos ela da lista de vez
        if (!entity.active) {
            this.entities.splice(i, 1);
            console.log("EntityManager: Entidade inativa limpa da memória.");
            continue;
        }

        // Se estiver ativa, atualiza normalmente
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