export default class InputHandler {
    constructor()
    {
        this.keyValue = [];
        this.keyOn = [];
    }

    addKey(key)
    {
        this.keyValue.push(key);
        this.keyOn.push(false);
    }

    eventKeyDown(event)
    {
        this.keyOn[this.keyValue.indexOf(event.key)] = true;
    }

    eventKeyUp(event)
    {
        this.keyOn[this.keyValue.indexOf(event.key)] = false;
    }

    isKeyOn(key)
    {
        return(this.keyOn[this.keyValue.indexOf(key)]);
    }
}