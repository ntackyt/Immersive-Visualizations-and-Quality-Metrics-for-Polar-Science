AFRAME.registerComponent('draw-annotate', {
	schema: {
	  enabled: {default: true},
	  cameraRigId: {default: 'cameraRig'},
	  planeWrapperId: {default: 'placePlanes'},
	//   onStart: {default: 'bbuttontouchstart'},
	//   onEnd: {default: 'bbuttontouchend'}
	},
  
	init: function () {

		this.cameraRigEl = document.getElementById(this.data.cameraRigId);
		this.planeWrapperEl = document.getElementById(this.data.planeWrapperId);

		this.controllers = {
			left: {
				entity: null,
				raycaster: null
			},
			right: {
				entity: null,
				raycaster: null
			}	
		};

		this.el.addEventListener('raycaster-intersected', evt => {
			console.log(evt)

		});

		this.el.addEventListener('raycaster-intersected-cleared', evt => {
			console.log(evt)
			;
		});
    },
  
  
	tick: function () {

    },  

	onButtonDown: function(evt) {

		console.log(evt)
	},
  
    registerHand: function (entity, hand) {
		// console.log(entity)

		this.controllers[hand].entity = entity;

		// x/a can be used for drawing
		
		if (hand === 'left') {
			this.leftHandEl = entity;
			entity.addEventListener('xbuttondown', this.onButtonDown.bind(this, 0));
			entity.addEventListener('xbuttonup', this.onButtonDown.bind(this, 0));
		} else {
			this.rightHandEl = entity;
			entity.addEventListener('abuttondown', this.onButtonDown.bind(this, 1));
			entity.addEventListener('abuttonup', this.onButtonDown.bind(this, 1));
		}
	}
  });
  
AFRAME.registerComponent('draw-annotate-hand', {
	schema: {
		hand: {default: 'right'}
	},

	play: function () {
		// console.log("called the play func...")
		this.el.sceneEl.components['draw-annotate'].registerHand(this.el, this.data.hand);
	}
});