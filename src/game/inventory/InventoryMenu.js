export class InventoryMenu {
    constructor(inventory, options = {}) {
        this.inventory = inventory;
        this.itemDatabase = options.itemDatabase || null;
        this.canvas = options.canvas || null;
        this.canOpen = options.canOpen || null;
        this.onOpen = options.onOpen || null;
        this.onClose = options.onClose || null;
        this.isOpen = false;
        this.selectedIndex = -1;

        this.onUseItem = options.onUseItem || null;
        this.useButton = { x: 350, y: 390, width: 90, height: 34 };




        this.columns = 5;
        this.slotSize = 48;
        this.slotGap = 8;
        this.gridX = 50;
        this.gridY = 112;
        this.closeButton = { x: 410, y: 58, width: 40, height: 36 };

        this.initEvents();
    }

    initEvents() {
        if (!this.canvas) {
            return;
        }

        this.canvas.addEventListener("pointerdown", (event) => {
            if (!this.isOpen) {
                return;
            }

            event.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * this.canvas.width / rect.width;
            const y = (event.clientY - rect.top) * this.canvas.height / rect.height;

            if (this.contains(this.closeButton, x, y)) {
                this.close();
                return;
            }

            if (this.contains(this.useButton, x, y)) {
                this.useSelectedItem();
                return;
            }

            const slotIndex = this.getSlotIndexAt(x, y);
            if (slotIndex !== -1) {
                this.selectedIndex = slotIndex;
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.canOpen && !this.canOpen()) {
            return;
        }

        this.isOpen = true;
        this.selectedIndex = -1;

        if (this.onOpen) {
            this.onOpen();
        }
    }

    close() {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;
        this.selectedIndex = -1;

        if (this.onClose) {
            this.onClose();
        }
    }

    getSlotRect(index) {
        const row = Math.floor(index / this.columns);
        const column = index % this.columns;
        const stride = this.slotSize + this.slotGap;

        return {
            x: this.gridX + column * stride,
            y: this.gridY + row * stride,
            width: this.slotSize,
            height: this.slotSize
        };
    }

    getSlotIndexAt(x, y) {
        if (!this.inventory) {
            return -1;
        }

        for (let index = 0; index < this.inventory.slots.length; index++) {
            if (this.contains(this.getSlotRect(index), x, y)) {
                return index;
            }
        }

        return -1;
    }

    contains(rect, x, y) {
        return (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );
    }

    drawText(ctx, text, x, y, color, font, align = "left") {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }

    render(renderer) {
        if (!this.isOpen) {
            return;
        }

        const ctx = renderer.context;

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(0, 0, renderer.width, renderer.height);

        ctx.fillStyle = "#2c2c35";
        ctx.fillRect(30, 40, 440, 420);
        ctx.strokeStyle = "#4e4e5a";
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 40, 440, 420);

        this.drawText(
            ctx,
            "INVENTÁRIO",
            renderer.width / 2,
            76,
            "#f3a953",
            "bold 22px Courier New",
            "center"
        );

        ctx.fillStyle = "#8b2d2d";
        ctx.fillRect(
            this.closeButton.x,
            this.closeButton.y,
            this.closeButton.width,
            this.closeButton.height
        );
        ctx.strokeStyle = "#a63d3d";
        ctx.strokeRect(
            this.closeButton.x,
            this.closeButton.y,
            this.closeButton.width,
            this.closeButton.height
        );
        this.drawText(
            ctx,
            "X",
            this.closeButton.x + this.closeButton.width / 2,
            this.closeButton.y + this.closeButton.height / 2,
            "#ffffff",
            "bold 18px Courier New",
            "center"
        );

        const slots = this.inventory ? this.inventory.slots : [];
        slots.forEach((slot, index) => {
            const rect = this.getSlotRect(index);

            ctx.fillStyle = index === this.selectedIndex ? "#6d5632" : "#18181f";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeStyle = index === this.selectedIndex ? "#f3a953" : "#4e4e5a";
            ctx.lineWidth = 2;
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

            if (!slot) {
                return;
            }

            const item = this.itemDatabase
                ? this.itemDatabase[slot.itemId]
                : null;
            const icon = item?.type === "weapon"
                ? "⚔"
                : slot.itemId === "ether"
                    ? "+"
                    : item?.type === "consumable"
                        ? "P"
                        : "?";

            this.drawText(
                ctx,
                icon,
                rect.x + rect.width / 2,
                rect.y + rect.height / 2,
                "#f3a953",
                "bold 24px Arial",
                "center"
            );

            if (slot.quantity > 1) {
                this.drawText(
                    ctx,
                    String(slot.quantity),
                    rect.x + rect.width - 5,
                    rect.y + rect.height - 7,
                    "#ffffff",
                    "bold 12px Arial",
                    "right"
                );
            }
        });

        this.renderSelectedItem(ctx, slots[this.selectedIndex]);
        ctx.restore();
    }

    renderSelectedItem(ctx, slot) {
        ctx.fillStyle = "#18181f";
        ctx.fillRect(50, 354, 400, 88);
        ctx.strokeStyle = "#4e4e5a";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 354, 400, 88);

        if (!slot) {
            this.drawText(
                ctx,
                this.selectedIndex === -1 ? "Selecione um item" : "Slot vazio",
                62,
                374,
                "#ffffff",
                "bold 14px Courier New"
            );
            return;
        }

        const item = this.itemDatabase
            ? this.itemDatabase[slot.itemId]
            : null;

        if (!item) {
            this.drawText(
                ctx,
                "Item desconhecido",
                62,
                374,
                "#ffffff",
                "bold 14px Courier New"
            );
            return;
        }

        this.drawText(
            ctx,
            item.name,
            62,
            372,
            "#ffffff",
            "bold 14px Courier New"
        );

        const description = item.description || "Sem descrição.";
        const maxLength = 34;
        const lines = description.match(new RegExp(`.{1,${maxLength}}`, "g")) || [];
        lines.slice(0, 2).forEach((line, index) => {
            this.drawText(
                ctx,
                line,
                62,
                395 + index * 16,
                "#bbbbbb",
                "12px Courier New"
            );
        });

        this.drawText(
            ctx,
            `${item.value ?? 0}G`,
            438,
            372,
            "#f3a953",
            "12px Courier New",
            "right"
        );
        if (item.type === "consumable") {
            ctx.fillStyle = "#236b32";
            ctx.fillRect(
                this.useButton.x,
                this.useButton.y,
                this.useButton.width,
                this.useButton.height
            );

            this.drawText(
                ctx,
                "USAR",
                this.useButton.x + this.useButton.width / 2,
                this.useButton.y + this.useButton.height / 2,
                "#ffffff",
                "bold 14px Courier New",
                "center"
            );
        }
    }
    useSelectedItem() {
    const slot = this.inventory?.getSlot(this.selectedIndex);
    const item = slot && this.itemDatabase
        ? this.itemDatabase[slot.itemId]
        : null;

    if (
        !slot ||
        !item ||
        item.type !== "consumable" ||
        !this.onUseItem
    ) {
        return;
    }

    if (this.onUseItem(item, slot)) {
        this.inventory.removeItem(slot.itemId, 1);
    }
}
}
