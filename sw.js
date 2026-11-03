const CACHE_NAME = "meu-rpg-shell-v1";
const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icons/game-icon.svg",
    "./icons/game-icon-192.png",
    "./icons/game-icon-512.png",
    "./src/main.js",
    "./src/content/items/ItemDatabase.js",
    "./src/engine/Camera.js",
    "./src/engine/Collider.js",
    "./src/engine/CollisionSystem.js",
    "./src/engine/Game.js",
    "./src/engine/GameConfig.js",
    "./src/engine/GameLoop.js",
    "./src/engine/Input.js",
    "./src/engine/Renderer.js",
    "./src/engine/RenderSystem.js",
    "./src/engine/StateMachine.js",
    "./src/engine/Time.js",
    "./src/engine/Transform.js",
    "./src/engine/Vector2.js",
    "./src/engine/input/GamepadInput.js",
    "./src/engine/input/KeyboardInput.js",
    "./src/engine/input/TouchInput.js",
    "./src/entities/Enemy.js",
    "./src/entities/Entity.js",
    "./src/entities/EntityManager.js",
    "./src/entities/Player.js",
    "./src/entities/Transform.js",
    "./src/game/Combat.js",
    "./src/game/inventory/Inventory.js",
    "./src/game/inventory/InventoryMenu.js",
    "./src/maps/MapManager.js",
    "./src/maps/TestMap.js",
    "./src/maps/TestMap2.js",
    "./src/maps/TestMap3.js",
    "./src/maps/TestMap4.js",
    "./src/states/GameOverState.js",
    "./src/states/GameState.js",
    "./src/states/MenuState.js",
    "./src/world/ObjectTypes.js",
    "./src/world/TileMap.js",
    "./src/world/TileTypes.js",
    "./src/world/World.js",
    "./src/world/WorldObject.js",
    "./assets/data/enemies.json",
    "./assets/sprites/heroi0A.png",
    "./assets/sprites/sa%C3%ADda0A.png",
    "./assets/sprites/slime0A.png",
    "./assets/sprites/tileset0A.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) =>
                        cacheName.startsWith("meu-rpg-shell-") &&
                        cacheName !== CACHE_NAME
                    )
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);
    const appScope = new URL(self.registration.scope);

    if (
        request.method !== "GET" ||
        requestUrl.origin !== appScope.origin ||
        !requestUrl.pathname.startsWith(appScope.pathname)
    ) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(async (response) => {
                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(request, response.clone());
                    }

                    return response;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request);
                    if (cachedPage) {
                        return cachedPage;
                    }

                    return caches.match(
                        new URL("index.html", appScope).href
                    );
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => cachedResponse || fetch(request))
    );
});
