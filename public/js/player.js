var BOOTSTRAP = (function($$) {    
    $$.player = {
        walking:   false,
        tileCount: 0,
        tileInt:   3,
        gx:        0,
        gy:        0,
        dir:       3        // Player direction (NW = 0, NE = 1, SE = 2, SW = 3),
    };

    return $$;
}(BOOTSTRAP || {}));