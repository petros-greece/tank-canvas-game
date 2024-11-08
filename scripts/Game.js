class Game {

	constructor(canvas, options = {}) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.team = 'Warriors';
		this.frame = 0;

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

		this.builder = new WorldBuilder(canvas);
		this.worldBuilders = options.worldBuilders || [];
		this.worldObjects = options.worldObjects || [];
		this.tankOpts = options.tankOpts || [];
		this.tanks = [];
		this.missiles = options.missiles || [];
		this.interval = null;
		this.init(canvas);
	}

	init(canvas) {

		const ctx = this.ctx;

		this.worldBuilders.forEach((builder) => {
			const objs = this.builder.giveTeamOfObjects(builder.builderOpts, builder.objectOpts);
			// Create a new GameObject for each set of options and render it
			objs.forEach((opts) => {
				const gameObject = new GameObject(ctx, opts); // Create a new GameObject with the options
				this.worldObjects.push(gameObject); // Add the object to the worldObjects array
			});
		})


		this.tankOpts.forEach((tankOpts) => {
			const tank = new Tank(ctx, tankOpts, this); // Create a new Tank with the options 
			this.tanks.push(tank); // Add the tank to the tanks array
		});






	}

	run(){
		const ctx = this.ctx;
		const cW = this.canvas.width;
		const cH = this.canvas.height;
		this.interval = setInterval(() => {
			//console.time('Game Loop')
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			
			// TANKS /////////////////////////////////////////////////////

			this.tanks.forEach((t, index) => {
    
				if(t.isDestroyed){
					this.tanks.splice(index,1)
				}
		
		
				this.missiles.forEach((missile, index) => {
					if( !t.isExploding  && missile.owner !== t.id && detectCollision(missile, t) && !missile.isExploding){
						missile.isExploding = true;
						t.addDamage(10);
					}
				});

				this.tanks.forEach((tank, tankIndex) => {
					if(tankIndex !== index &&  detectCollision(tank, t) ) {
						t.collide(tank);
						tank.collide(t);
						t.moveToPos = t.position;          
					}
				});

				t.move();
				
			});

			// OBJECTS /////////////////////////////////////////////////

			this.worldObjects.forEach(obj => {
    
				this.tanks.forEach((t, index) => {
					
					if (detectCollision(t, obj)) {
						t.collide(obj);
						//t.moveToPos = t.position;
					}
					
				})


				this.missiles.forEach((missile, index) => {
					if( missile.owner !== obj.id && detectCollision(missile, obj) && !missile.isExploding){
						missile.isExploding = true;
						obj.getHit(missile);
					}
				});


				this.worldObjects.forEach(o => {
					if( detectCollision(o, obj) ){
						obj.collide(o)
						
					}
				})


				obj.render()

				//obj.update(game.missiles)

			});


			// 	MISSILES /////////////////////////////////////////////////////////

			this.missiles.forEach((missile, index) => {
				if( missile.hasExploded ){
					this.missiles.splice(index,1)
				}
				missile.render();
			});


			this.frame+=1;
		
			//console.timeEnd('Game Loop')

		}, 10);

	}

	attachEvents(){
		let selectedTankIndex = -1;

		this.canvas.addEventListener('click', (event) => {
			const rect = canvas.getBoundingClientRect();
			const position = { x: event.clientX - rect.left, y: event.clientY - rect.top }
			const tanks = this.tanks;
			let isClicked = false;
			let isFiring = false;

			//check if object is to get fired
		
			this.worldObjects.forEach((obj) => {
				if ( checkIfClicked(position, obj) )  {	
					isFiring = true;
					tanks[selectedTankIndex].stop();
					tanks[selectedTankIndex].targetPos =  position;
					tanks[selectedTankIndex].isFiring = true;
			
				}
			});

			//check if another tank is firing
			tanks.forEach((t, index) => {

				t.isSelected = false;
				
				if ( checkIfClicked(position, t) )  {
					if (t.team === this.team) {
						selectedTankIndex = index;
						isClicked = true;
					}
					else{
						tanks[selectedTankIndex].targetPos = position;
						tanks[selectedTankIndex].isFiring = true;
						tanks[selectedTankIndex].stop();
						isFiring = true;
						isClicked = true;
					


					}
				}

			


			});

			// Move the selected tank to the clicked point
			if (!isClicked && !isFiring) {
				this.tanks[selectedTankIndex].moveToPos = position;
				this.tanks[selectedTankIndex].go();
			}
			this.tanks[selectedTankIndex].isSelected = true;


		});		
	}
	addMissile(missile){
		this.missiles.push(missile);
	}


}
