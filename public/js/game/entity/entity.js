define(function () {
    /**
     * @class Entity
     */
    return $C.extend({

        // Define animation states for an entity
        STATE_STANDING: 0,
        STATE_WALKING: 1,
        STATE_RUNNING: 2,
        STATE_FALLING: 3,
        STATE_JUMPING: 4,
        STATE_DAMAGE: 5,
        STATE_DEAD: 6,
        STATE_DEFENSE: 7,
        STATE_ATTACK: 8,
        STATE_MAGIC: 9,

        state: 0,
        globalX: 0,
        globalY: 0,
        globalZ: 0,
        globalDir: 0,

        // An animation frame loop between any tile
        frameCount: 0,
        frameLoop: 3,

        // Offsets for next tile after an animation cycle            
        dDir: 0,
        dX: 0,
        dY: 0,
        dZ: 0,

        // Get the next offsets while using previous offsets for animation calculations                    
        queuedDX: 0,
        queuedDY: 0,
        queuedDZ: 0,
        queuedDir: 0,
        queuedState: 0,

        jumpMin: 2,
        jumpMax: 4,
        fallMin: -2,
        fallMax: -8,

        init: function (x, y, z, dir) {
            this.state = this.STATE_STANDING;

            // Direction and location on the world map
            this.globalX = x || 0;
            this.globalY = y || 0;
            this.globalZ = z || 0;
            this.globalDir = dir || 0;
        },

        changeDirection: function (dir) {
            this.queuedDir = dir - this.globalDir;

            switch (dir) {
                case 0:
                    this.queuedDX = -1;
                    break;
                case 1:
                    this.queuedDY = -1;
                    break;
                case 2:
                    this.queuedDX = 1;
                    break;
                case 3:
                    this.queuedDY = 1;
                    break;
            }
        },

        getDetails: function () {
            return {
                'x': this.globalX + this.queuedDX,
                'y': this.globalY + this.queuedDY,
                'z': this.globalZ
            }
        },

        changeState: function (qz) {
            this.queuedDZ = qz;

            // If they are standing, let them turn and look around
            // (Note, if walking, it will turn and move)
            if (this.state == this.STATE_STANDING && this.queuedDir != 0) {
                console.log('turning');

                this.queuedDX = 0;
                this.queuedDY = 0;
                this.queuedDZ = 0;

                return;
            }

            if (this.queuedDZ > this.jumpMax || this.queuedDZ < this.fallMax) {
                console.log('not safe');

                // Too dangerous a jump or too big a climb, don't move
                this.queuedDX = 0;
                this.queuedDY = 0;
                this.queuedDZ = 0;

                return;

            } else if (this.queuedDZ > this.jumpMin || this.queuedDZ < this.fallMin) {
                console.log('queue jumping');
                this.queuedState = this.STATE_JUMPING;
                return;

            } else {
                console.log('queue walking');
                this.queuedState = this.STATE_WALKING;
                return;

            }
        },

        getFrameOffset: function () {
            if (this.frameCount < this.frameLoop) {
                var percent = (this.frameCount + 1) / this.frameLoop;
                this.frameCount++;

                return {
                    gx: this.globalX,
                    gy: this.globalY,
                    x: this.dX * percent + this.globalX,
                    y: this.dY * percent + this.globalY,
                    z: this.dZ * percent + this.globalZ,
                    dir: this.globalDir,
                    state: this.state,
                    step: this.frameCount % this.frameLoop,
                    entity: this
                };
            } else {
                // We have completed a loop, update the global coordinates of entity
                this.globalX += this.dX;
                this.globalY += this.dY;
                this.globalZ += this.dZ;
                this.globalDir += this.queuedDir;

                this.state = this.queuedState;

                // Then pass along any queued changes occurred during last animation
                this.dX = this.queuedDX;
                this.dY = this.queuedDY;
                this.dZ = this.queuedDZ;

                // Then clear the queued values
                this.queuedDX = 0;
                this.queuedDY = 0;
                this.queuedDZ = 0;

                this.queuedDir = 0;
                this.queuedState = this.STATE_STANDING;

                // Reset frame counter
                this.frameCount = 0;

                // Return the current position of player
                return {
                    gx: this.globalX,
                    gy: this.globalY,
                    x: this.globalX,
                    y: this.globalY,
                    z: this.globalZ,
                    dir: this.globalDir,
                    state: this.state,
                    entity: this
                };
            }
        },

        setPosition: function (x, y, z, dir, state) {
            if (!_.isUndefined(x))     this.globalX = x;
            if (!_.isUndefined(y))     this.globalY = y;
            if (!_.isUndefined(z))     this.globalZ = z;
            if (!_.isUndefined(dir))   this.globalDir = dir;
            if (!_.isUndefined(state)) this.state = state;
        }
    });
});
