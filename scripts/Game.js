class Game {

    constructor(ctx, options = {}) {
        this.ctx = ctx;
        
        // Initialize properties from options or set to default values
        this.tanks = options.tanks || []; // Array to hold all tank objects
        this.missiles = options.missiles || []; // Array to hold all missile objects
        this.objects = options.objects || []; // Array to hold other game objects (e.g., obstacles)
        
        this.stage = options.stage || 1; // Current stage or level in the game
        this.score = options.score || 0; // Player's score
        this.time = options.time || 0; // Game time elapsed (e.g., in seconds)
        
        // Optional: Initialize stats (e.g., for tracking game performance or player stats)
        this.stats = options.stats || {
            kills: 0,
            hits: 0,
            shotsFired: 0,
            accuracy: 0,
        };
        
        // Optionally, initialize more game settings or states from options
        this.settings = options.settings || {
            difficulty: "normal",
            maxMissiles: 10,
            maxTanks: 5,
            stageBackground: "#333",
        };
    }

    init(){
        
    }

}
