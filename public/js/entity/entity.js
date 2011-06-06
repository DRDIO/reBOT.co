define(function() {
    APP.Entity = function(x, y, z, dir) { 
        // Define animation states for an entity
        this.STATE_STANDING = 0;
        this.STATE_WALKING  = 1;
        this.STATE_RUNNING  = 2;
        this.STATE_FALLING  = 3;
        this.STATE_JUMPING  = 4;
        this.STATE_DAMAGE   = 5;
        this.STATE_DEAD     = 6;
        this.STATE_DEFENSE  = 7;
        this.STATE_ATTACK   = 8;
        this.STATE_MAGIC    = 9;
        
        this.state = this.STATE_STANDING;
        
        // Direction and location on the world map
        this.globalX   = x;
        this.globalY   = y;
        this.globalZ   = z;
        this.globalDir = dir;
        
        // An animation frame loop between any tile
        this.frameCount = 0;
        this.frameLoop  = 3;
        
        // Offsets for next tile after an animation cycle
        this.dDir = 0;
        this.dX   = 0;
        this.dY   = 0;
        this.dZ   = 0;
        
        // Get the next offsets while using previous offsets for animation calculations
        this.queuedDDir = 0;
        this.queuedDX   = 0;
        this.queuedDY   = 0;
        this.queuedDZ   = 0;

        this.jumpMin = 2;
        this.jumpMax = 4;        
        this.fallMin = -2;
        this.fallMax = -8;
    }
        
    Player.prototype.getFrameOffsets = function() {
        if (this.frameCount < this.frameLoop) {
            var percent = (this.frameCount + 1) / this.frameLoop;
            this.frameCount++;
            
            return {
                x:     this.dX * percent + this.globalX,
                y:     this.dX * percent + this.globalY,
                z:     this.dX * percent + this.globalZ,
                dir:   this.globalDir,
                state: this.state
            };
        } else {
            // We have completed a loop, update the global coordinates of entity
            this.globalX   += this.dY;
            this.globalY   += this.dY;
            this.globalZ   += this.dZ;
            this.globalDir += this.dDir;
            
            // Then pass along any queued changes occurred during last animation
            this.dX   = this.queuedDX;
            this.dY   = this.queuedDY;
            this.dZ   = this.queuedDZ;
            this.dDir = this.queuedDDir;
            
            // Then clear the queued values
            this.queuedDX   = 0;
            this.queuedDY   = 0;
            this.queuedDZ   = 0;
            this.queuedDDir = 0;
            
            // Reset frame counter
            this.frameCount = 0;
            
            // Return the current position of player
            return {
                x:     this.globalX,
                y:     this.globalY,
                z:     this.globalZ,
                dir:   this.globalDir,
                state: this.state
            };
        }
    }
});