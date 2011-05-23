define(function() {
    var Keyboard = function() {
        // Directional keys
        this.KEY_NW       = 65,
        this.KEY_NE       = 87,
        this.KEY_SE       = 68,
        this.KEY_SW       = 83;
        this.KEY_SETTINGS = 81;

        this.isShift    = false;
        this.keyPressed = false;
    }

    Keyboard.prototype.press = function(key) {
        this.keyPressed = key;

        if (key == this.KEY_SETTINGS) {
            return 'settings';
        } else if (key == this.KEY_NW || key == this.KEY_NE || key == this.KEY_SE || key == this.KEY_SW) {
            return 'move';
        }

        return 'unknown';
    }

    Keyboard.prototype.mapDirection = function()
    {
        var direction = null;

        switch (this.keyPressed) {
            case this.KEY_NW:
                direction = 0;
                break;
            case this.KEY_NE:
                direction = 1;
                break;
            case this.KEY_SE:
                direction = 2;
                break;
            case this.KEY_SW:
                direction = 3;
                break;
        }

        return direction;
    }

    Keyboard.prototype.release = function(key) {
        this.keyPressed = false;
    }

    Keyboard.prototype.isPressed = function() {
        return this.keyPressed != false;
    }

    Keyboard.prototype.getKey = function() {
        return this.keyPressed;
    }

    APP.keyboard = new Keyboard();
});