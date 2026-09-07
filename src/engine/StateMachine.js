export class StateMachine {

    constructor() {

        this.states = new Map();
        this.currentState = null;
    }


    add(name, state) {

        this.states.set(name, state);
    }


    change(name) {

        const nextState = this.states.get(name);

        if (!nextState) {
            console.error(`Estado "${name}" não encontrado.`);
            return;
        }


        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }


        this.currentState = nextState;


        if (this.currentState.enter) {
            this.currentState.enter();
        }
    }


    update(delta) {

        if (!this.currentState) {
            return;
        }

        if (this.currentState.update) {
            this.currentState.update(delta);
        }
    }


    render(renderer) {

        if (!this.currentState) {
            return;
        }

        if (this.currentState.render) {
            this.currentState.render(renderer);
        }
    }
}
