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
        this.globalX   = x   || 0;
        this.globalY   = y   || 0;
        this.globalZ   = z   || 0;
        this.globalDir = dir || 0;
        
        // An animation frame loop between any tile
        this.frameCount = 0;
        this.frameLoop  = 3;
        
        // Offsets for next tile after an animation cycle
        this.dDir = 0;
        this.dX   = 0;
        this.dY   = 0;
        this.dZ   = 0;
        
        // Get the next offsets while using previous offsets for animation calculations        
        this.queuedDX    = 0;
        this.queuedDY    = 0;
        this.queuedDZ    = 0;
        
        this.queuedDir   = 0;
        this.queuedState = this.STATE_STANDING;

        this.jumpMin = 2;
        this.jumpMax = 4;        
        this.fallMin = -2;
        this.fallMax = -8;
    };
      
    APP.Entity.prototype.move = function(dir)
    {   
        this.queuedDir = dir - this.globalDir;
        
        // If they are standing, let them turn and look around
        // (Note, if walking, it will turn and move)
        if (this.state == this.STATE_STANDING && this.globalDir != dir) {
            console.log('turning');
            return;
        }
        
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
            default:
                return;
        }

        // Determine where next Z will be from the world
        this.queuedDZ = APP.world.getTile(this.globalX + this.queuedDX, this.globalY + this.queuedDY).getZ() - this.globalZ;

        if (this.queuedDZ > this.jumpMax || this.queuedDZ < this.fallMax) {
            console.log('not safe');
            
            // Too dangerous a jump or too big a climb, don't move
            this.queuedDX   = 0;
            this.queuedDY   = 0;
            this.queuedDZ   = 0;            
            
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
    };
    
    APP.Entity.prototype.getFrameOffsets = function() 
    {
        if (this.frameCount < this.frameLoop) {            
            var percent = (this.frameCount + 1) / this.frameLoop;
            this.frameCount++;
            
            return {
                gx:    this.globalX,
                gy:    this.globalY,
                x:     this.dX * percent + this.globalX,
                y:     this.dY * percent + this.globalY,
                z:     this.dZ * percent + this.globalZ,
                dir:   this.globalDir,
                state: this.state
            };
        } else {            
            // We have completed a loop, update the global coordinates of entity
            this.globalX   += this.dX;
            this.globalY   += this.dY;
            this.globalZ   += this.dZ;            
            this.globalDir += this.queuedDir;
            
            this.state      = this.queuedState;
            
            // Then pass along any queued changes occurred during last animation
            this.dX   = this.queuedDX;
            this.dY   = this.queuedDY;
            this.dZ   = this.queuedDZ;
            
            // Then clear the queued values
            this.queuedDX    = 0;
            this.queuedDY    = 0;
            this.queuedDZ    = 0;
            
            this.queuedDir   = 0;
            this.queuedState = this.STATE_STANDING;
            
            // Reset frame counter
            this.frameCount = 0;
            
            // Return the current position of player
            return {
                gx:    this.globalX,
                gy:    this.globalY,
                x:     this.globalX,
                y:     this.globalY,
                z:     this.globalZ,
                dir:   this.globalDir,
                state: this.state
            };
        }
    }
    
    /**
     * Set the variables of any entity
     * TODO: Add support for 0 coordinates
     */
    APP.Entity.prototype.setPosition = function(x, y, z, dir, state) 
    {
        if (x)     this.globalX   = x;
        if (y)     this.globalY   = y;
        if (z)     this.globalZ   = z;
        if (dir)   this.globalDir = dir;
        if (state) this.state     = state;
    }
});