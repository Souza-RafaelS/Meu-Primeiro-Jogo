import { ItemDatabase }
from "../../content/items/ItemDatabase.js";

export class Inventory {

    constructor(size = 10) {

        this.size = size;

        this.slots = new Array(size)
            .fill(null);

    }

    addItem(itemId, quantity = 1) {

        const item = ItemDatabase[itemId];

        if (!item) {

            console.warn(
                `[Inventory] Item inválido: ${itemId}`
            );

            return false;

        }

        const existingSlot = this.slots.find(slot =>
            slot &&
            slot.itemId === itemId
        );

        if (existingSlot) {

            existingSlot.quantity += quantity;

            return true;

        }

        const emptyIndex =
            this.slots.findIndex(
                slot => slot === null
            );

        if (emptyIndex === -1) {

            console.warn(
                "[Inventory] Inventário cheio."
            );

            return false;

        }

        this.slots[emptyIndex] = {
            itemId,
            quantity
        };

        return true;

    }

    removeItem(itemId, quantity = 1) {

        const slot = this.slots.find(slot =>
            slot &&
            slot.itemId === itemId
        );

        if (!slot) {
            return false;
        }

        slot.quantity -= quantity;

        if (slot.quantity <= 0) {

            const index =
                this.slots.indexOf(slot);

            this.slots[index] = null;

        }

        return true;

    }

    hasItem(itemId) {

        return this.getItemCount(itemId) > 0;

    }

    getItemCount(itemId) {

        const slot = this.slots.find(slot =>
            slot &&
            slot.itemId === itemId
        );

        return slot
            ? slot.quantity
            : 0;

    }

    getItem(itemId) {

        return ItemDatabase[itemId] || null;

    }

    getSlot(index) {

        if (
            index < 0 ||
            index >= this.size
        ) {
            return null;
        }

        return this.slots[index];

    }

    getItems() {

        return this.slots.filter(
            slot => slot !== null
        );

    }

    clear() {

        this.slots.fill(null);

    }

    serialize() {

        return JSON.stringify(
            this.slots
        );

    }

    deserialize(data) {

        this.slots =
            JSON.parse(data);

    }

}