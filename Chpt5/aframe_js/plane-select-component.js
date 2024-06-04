AFRAME.registerComponent('plane-select', {
	
	dependencies: ['raycaster'],

	schema: {
	  enabled: {default: true},
	  cameraRigId: {default: 'cameraRig'},
	  planeWrapperId: {default: 'placePlanes'}
	},
  
	init: function () {
		this.cameraRigEl = document.getElementById(this.data.cameraRigId);
		this.planeWrapperEl = document.getElementById(this.data.planeWrapperId);
		this.hidden_planes = false; // Indicates if we have a selected plane

		this.all_planes = this.planeWrapperEl.children
		this.hidden_planes = false
	
		this.controllers = {
			left: {
			entity: null,
			},
			right: {
			entity: null,
			}
		};

		// set up raycaster controls
		this.el.addEventListener('raycaster-intersected', evt => {
			/*
			https://aframe.io/docs/1.5.0/components/raycaster.html
			raycaster-intersected
			Emitted on the intersected entity. Entity is intersecting with a raycaster. 
			Event detail will contain el, the raycasting entity, and intersection, and 
			.getIntersection (el) function which can be used to obtain current 
			intersection data.

			Ideally selection woul be allowed from either hand, the evt tells which hand selected. 
			Then if they Y button is used the raycaster from the left had would be used... and Righ if B... 
			However, not sure how flexiable this is across controllers so Im going to leave it as left hand only
			Note: It would be good to let them chose their handed-ness, im dev for righthanded people 
				  since im right handed, but left handed would wnat to annotate with their left hand 

			*/
			// console.log("intersected event")
			this.raycaster = evt;
		});

		this.el.addEventListener('raycaster-intersected-cleared', evt => {
			// console.log("cleared event")
			// this.raycaster = null; // cased problems re-selecting the same plane 
			this.selected_plane = null;
		});
  
	},
  
  
	tick: function () {

		// if (!this.raycaster) { return; }  // Not intersecting.
		// check all planes
		// for(let p of this.all_planes){
			// let intersection = this.raycaster.components.raycaster.getIntersection(p);
			// if (! intersection) { return; }
			// console.log(intersection.object.el.id); // Print the intersected ids
		// }
	},  
  
	// point down function
	onButtonDown: function (evt) {

		console.log("called hide other planes")
		// console.log("selected plane", this.selected_plane, this.raycaster, this.hidden_planes)

		// Get the intersected entity
		if (this.raycaster && !this.hidden_planes) { 

			// ID the closested plane
			let distance = Infinity
			let planeNum = -1
			for(let p of this.all_planes){
				// console.log("p", p)
				let intersection = this.raycaster.detail.el.components.raycaster.getIntersection(p);
				// console.log("intersection", intersection)
				if (! intersection) { continue; }
				// console.log(intersection);
				if (intersection.distance < distance){
					distance = intersection.distance
					this.selected_plane = intersection
					planeNum = this.selected_plane.object.el.id
					// console.log("plane:", this.selected_plane.object)
					// console.log("plane id:", planeNum)
				}
			}
			// console.log("selected_plane: ", this.selected_plane )
						
			if ( ! this.selected_plane ){ 
				console.log("ERROR - no intersection")	
				return; 
			}
			// Set visibility
			for (let plane of this.all_planes){
				// console.log(plane.id, planeNum)
				if( plane.id == planeNum ) { console.log(plane.id, planeNum); continue; }
				plane.object3D.visible = false
				plane.flushToDOM(); 				
			}
			// clear out
			this.selected_plane = null;
			// this.raycaster = null; // this might cause problems reselecting the same plane ?
			// console.log("raycaster val after select: ", this.raycaster)
			return;
		}

		// Reshow all the planes
		for (let plane of this.all_planes){
			plane.object3D.visible = true
			plane.flushToDOM(); 
		}
	
	},
	
	// point down function
	onButtonUp: function (evt) {
		// GOAL: Write code that  places camera infront of the selected plane - unable to figure out at this point
		// console.log("called move camera")
		// console.log("Button released:", evt)
		// console.log(this)

		// give up on this for now
		/*
		// if we're clicking to enter 
		if (!this.hidden_planes){

			console.log("time to move camera")
			// console.log("before: ", this.cameraRigEl)
			// console.log("camera: ", this.cameraRigEl.children.camera)
			// console.log("before: ", this.cameraRigEl)
			console.log("plane: ", this.selected_plane)
			// Upon entering - set the position
			let plane_pos = this.selected_plane.getAttribute("position")
			console.log("plane pos", plane_pos)


			// https://github.com/supermedium/superframe/blob/master/components/look-at/README.md

			this.cameraRigEl.children.camera.setAttribute("look-at", "#"+this.selected_plane.id)
			this.cameraRigEl.children.camera.flushToDOM();
			/*
			// https://stackoverflow.com/questions/62806316/how-to-look-to-objects-using-lookat-with-a-frame-camera-component-and-look-con
			// https://stackoverflow.com/questions/39579380/a-frame-js-camera-rotation-with-look-controls/39579425#39579425 
			// get the camera
			let camera = this.cameraRigEl.children.camera
			console.log("cam", camera)
			// disable look-controls to override with lookat
			camera.setAttribute('look-controls', {enabled: false})
			camera.flushToDOM(); 

			// set lookat - 
			// https://glitch.com/~aframe-lookat-camera-working
			// camera.object3D.lookAt( this.selected_plane.position ); // midpoint
			camera.object3D.lookAt(plane_pos.x, plane_pos.y, plane_pos.z); // midpoint
			camera.object3D.updateMatrix(); 
			console.log("rot", camera.object3D.rotation)
			console.log("components", camera.components)
			var rotation = camera.object3D.rotation
			camera.components['look-controls'].pitchObject.rotation.x = rotation.x;
			camera.components['look-controls'].yawObject.rotation.y = rotation.y;
			console.log("cam", camera)
			camera.flushToDOM(); 
			
			// renable look-controls
			// camera.setAttribute('look-controls', {enabled: true})
			// fush to dom
			camera.flushToDOM(); 
			// /


			console.log("cam el after:", this.cameraRigEl.children.camera)
			console.log("cam", camera)
			console.log("cam pos", this.cameraRigEl.children.camera.getAttribute("position"))
		}
		*/
	
		/*
		// set distance from 
		x_camera = midx + t
		y_camera = mid_y- 1/ m * t
		
		dist  = sqrt ( t^2 - (t^2/m^2))
		
		d = t * sqrt(1+1/m)
		
		*/
		
		// swap everytime
		this.hidden_planes = !this.hidden_planes
		
	},
  
  
	registerHand: function (entity, hand) {

		this.controllers[hand].entity = entity;

		//  y/b does the hide/unhide planes
		//  x/a can be used for drawing

		if (hand === 'left') {
			this.leftHandEl = entity;
			entity.addEventListener('ybuttondown', this.onButtonDown.bind(this));
			entity.addEventListener("ybuttonup", this.onButtonUp.bind(this));
		} else {
			// this.rightHandEl = entity;
			// entity.addEventListener('bbuttondown', this.onButtonDown.bind(this));
			// entity.addEventListener("bbuttonup", this.onButtonUp.bind(this));
		}
	}
  });
  
AFRAME.registerComponent('plane-select-hand', {
	schema: {
		hand: {default: 'right'}
	},

	play: function () {
		// console.log("called the play func...")
		this.el.sceneEl.components['plane-select'].registerHand(this.el, this.data.hand);
	}
});

