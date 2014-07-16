define({
    spritePaths: {
        player: '/img/npc/player.png'
    },

    domCanvas: '#game',

    mixer: {
        // On/Off Settings
        'jetpack': {l: 'Player Jetpack', v: 1, i: 0, a: 1, s: 1},
        'random':  {l: 'Random Tiles',   v: 1, i: 0, a: 1, s: 1},
        'drought': {l: 'Drought',        v: 0, i: 0, a: 1, s: 1},

        // Core Sliders and Steps
        'fps':   {l: 'FPS',           v: 45, i: 5, a: 120, s: 5},
        'zstep': {l: 'Step Height',   v: 4, i: 0, a: 32,  s: 1, r: true},
        'rstep': {l: 'Render Radius', v: 32, i: 1, a: 32,  s: 1, r: true},

        // Noise Terrain Generation
        'nstep1': {l: 'Frequency 1', v: 128, i: 0, a: 512, s: 32, r: true},
        'namp1':  {l: 'Amplitude 1', v: 4,  i: 0, a: 128, s: 1, r: true},
        'nstep2': {l: 'Frequency 2', v: 16,  i: 0, a: 128, s: 8, r: true},
        'namp2':  {l: 'Amplitude 2', v: 16,   i: 0, a: 64,  s: 1, r: true},

        // Terrain Type Levels
        'lvlwater': {l: 'Water Level', v: -80,  i: -100, a: 100, s: 1},
        'lvlbeach': {l: 'Beach Level', v: -70,  i: -100, a: 100, s: 1},
        'lvlplain': {l: 'Plain Level', v: -60,  i: -100, a: 100, s: 1},
        'lvlhill':  {l: 'Hill Level',  v: 20,   i: -100, a: 100, s: 1},
        'lvlmount': {l: 'Mount Level', v: 60,   i: -100, a: 100, s: 1},
        'lvlsnow':  {l: 'Snow Level',  v: 90,   i: -100, a: 100, s: 1}
    }
});
