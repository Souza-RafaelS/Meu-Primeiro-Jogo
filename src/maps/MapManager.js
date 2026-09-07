import { TestMap } from "./TestMap.js";
import { TestMap2 } from "./TestMap2.js";
import { TestMap3 } from "./TestMap3.js";
import { TestMap4 } from "./TestMap4.js";

export class MapManager {

constructor() {

    this.maps = new Map();


    // ========================================
    // REGISTRAR MAPAS
    // ========================================

    this.register(
        "test",
        TestMap
    );
    this.register(
        "test2",
        TestMap2
    );
    this.register(
        "test3",
        TestMap3
    );
    this.register(
        "test4",
        TestMap4
    );
}


// ========================================
// REGISTRAR
// ========================================

register(id, mapData) {

    if (!id) {

        console.warn(
            "MapManager: ID de mapa inválido."
        );

        return;
    }


    if (!mapData) {

        console.warn(
            "MapManager: mapa inválido:",
            id
        );

        return;
    }


    this.maps.set(
        id,
        mapData
    );


    console.log(
        "Mapa registrado:",
        id
    );
}


// ========================================
// OBTER MAPA
// ========================================

get(id) {

    const map =
        this.maps.get(id);


    if (!map) {

        console.warn(
            "Mapa não encontrado:",
            id
        );

        return null;
    }


    return map;
}


// ========================================
// VERIFICAR EXISTÊNCIA
// ========================================

has(id) {

    return this.maps.has(
        id
    );
}


// ========================================
// LISTAR MAPAS
// ========================================

getAll() {

    return [
        ...this.maps.keys()
    ];
}


// ========================================
// REMOVER
// ========================================

remove(id) {

    return this.maps.delete(
        id
    );
}


// ========================================
// LIMPAR
// ========================================

clear() {

    this.maps.clear();
}


}