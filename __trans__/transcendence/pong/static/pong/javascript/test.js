export class PongInput {
    constructor()
    {
        this.keyValues = [];
        this.PongInputInit();
    }

    PongInputInit()
    {
        this.keyValues.push('w');
        this.keyValues.push('s');
    }

    getKeyCode(keyCode)
    {
        if (this.keyValues.indexOf(keyCode) === -1)
            return (-1);
        return (this.keyValues[this.keyValues.indexOf(keyCode)]);
    }
}