AFRAME.registerComponent('camera-transform-controls', {
	schema: {
	  enabled: {default: true},
	  cameraRigId: {default: 'cameraRig'},
	  worldWrapperId: {default: 'worldWrapper'},
	  onStart: {default: 'gripdown'},
	  onEnd: {default: 'gripup'}
	},
  
	init: function () {
	  this.cameraRigEl = document.getElementById(this.data.cameraRigId);
	  this.worldWrapperEl = document.getElementById(this.data.worldWrapperId);
  
	  this.currentDragCenter = new THREE.Vector3();
	  this.panningController = null;
  
	  this.controllers = {
		left: {
		  entity: null,
		  dragging: false,
		  startPoint: new THREE.Vector3()
		},
		right: {
		  entity: null,
		  dragging: false,
		  startPoint: new THREE.Vector3()
		}
	  };
  
	  this.originalPosition = new THREE.Vector3();
	  this.originalScale = new THREE.Vector3();
	  this.originalRotation = new THREE.Vector3();
  
	  this.isLeftButtonDown = false;
	  this.isRightButtonDown = false;
  
	  this.cameraScaleEventDetail = {cameraScaleFactor: 1};
	},
  
	/**
	 * Reset original camera rig transforms if disabling camera scaler.
	 */
	update: function (oldData) {
	  var cameraRigEl = this.cameraRigEl;
  
	  if (!cameraRigEl) {return;}
  
	  // Enabling. Store original transformations.
	  if (!oldData.enabled && this.data.enabled) {
		this.originalPosition.copy(cameraRigEl.object3D.position);
		this.originalScale.copy(cameraRigEl.object3D.scale);
		this.originalRotation.copy(cameraRigEl.object3D.rotation);
	  }
  
	  // Disabling, reset to original transformations.
	  if (oldData.enabled && !this.data.enabled) {
		cameraRigEl.setAttribute('position', this.originalPosition);
		cameraRigEl.setAttribute('scale', this.originalScale);
		cameraRigEl.setAttribute('rotation', this.originalRotation.clone());
	  }
	},
  
	tick: function () {
	  if (!this.data.enabled) { return; }
  
	  if (!this.isLeftButtonDown && !this.isRightButtonDown) { return; }
  
	  if (this.isLeftButtonDown && this.isRightButtonDown) {
		this.twoHandInteraction();
	  } else {
		this.oneHandInteraction();
	  }
	},
  
	onButtonDown: function (evt) {
	  var left;
	  var target;
  
	  if (!this.cameraRigEl.object3D) { return; }
  
	  target = evt.target;
	  left = target === this.leftHandEl;
  
	  if (left) {
		this.isLeftButtonDown = true;
		this.panningController = this.controllers.left;
	  } else {
		this.isRightButtonDown = true;
		this.panningController = this.controllers.right;
	  }
  
	  this.controllers.left.entity.object3D.getWorldPosition(
		this.controllers.left.startPoint);
	  this.controllers.right.entity.object3D.getWorldPosition(
		this.controllers.right.startPoint);
  
	  this.released = this.isLeftButtonDown && this.isRightButtonDown;
	},
  
	onButtonUp: function (evt) {
	  var left;
	  var target;
  
	  target = evt.target;
	  left = evt.target === this.leftHandEl;
  
	  if (left) {
		this.panningController = this.controllers.right;
		this.isLeftButtonDown = false;
	  } else {
		this.panningController = this.controllers.left;
		this.isRightButtonDown = false;
	  }
  
	  this.panningController.entity.object3D.getWorldPosition(
		this.panningController.startPoint);
  
	  if (!this.isLeftButtonDown && !this.isRightButtonDown) {
		this.cameraScaleEventDetail.cameraScaleFactor = this.cameraRigEl.object3D.scale.x;
		this.el.emit('camerascale', this.cameraScaleEventDetail);
	  }
  
	  this.released = true;
	},
  
	twoHandInteraction: (function () {
	  var midPoint = new THREE.Vector3();
  
	  return function () {
		if (this.released) {
		  this.released = false;
		}
		this.transformScene();
	  }
	})(),
  
	transformScene: (function () {
  
	  return function() {
  
		var leftPointNow = new THREE.Vector3();
		var rightPointNow = new THREE.Vector3();
		var cameraPosition = new THREE.Vector3();
  
		const M = new THREE.Matrix4();
  
		this.controllers.left.entity.object3D.getWorldPosition(leftPointNow);
		this.controllers.right.entity.object3D.getWorldPosition(rightPointNow);
		this.cameraRigEl.object3D.getWorldPosition(cameraPosition);
  
		var scale = leftPointNow.distanceTo(rightPointNow)
					/ this.controllers.left.startPoint.distanceTo(this.controllers.right.startPoint);
  
		var theta = Math.atan2(rightPointNow.x-leftPointNow.x,rightPointNow.z-leftPointNow.z)
					- Math.atan2(this.controllers.right.startPoint.x-this.controllers.left.startPoint.x,
								 this.controllers.right.startPoint.z-this.controllers.left.startPoint.z)
		var cosTheta = Math.cos(theta);
		var sinTheta = Math.sin(theta);
  
		var midStart = new THREE.Vector3();
		var midNow = new THREE.Vector3();
		midStart.addVectors( this.controllers.right.startPoint , this.controllers.left.startPoint ).divideScalar( 2 );
		midNow.addVectors( leftPointNow, rightPointNow ).divideScalar( 2 );
  
		M.set(scale*cosTheta,     0, scale*sinTheta, midNow.x-scale*(cosTheta*midStart.x+sinTheta*midStart.z),
						   0, scale,              0, midNow.y-scale*midStart.y,
			 -scale*sinTheta,     0, scale*cosTheta, midNow.z-scale*(-sinTheta*midStart.x+cosTheta*midStart.z),
						   0,     0,              0, 1);
  
		this.worldWrapperEl.object3D.applyMatrix4(M);
  
		this.controllers.left.entity.object3D.getWorldPosition(this.controllers.left.startPoint);
		this.controllers.right.entity.object3D.getWorldPosition(this.controllers.right.startPoint);
  
	  };
	})(),
  
	oneHandInteraction: (function () {
	  var currentPosition = new THREE.Vector3();
	  var deltaPosition = new THREE.Vector3();
  
	  return function () {
		var startPoint = this.panningController.startPoint;
		this.panningController.entity.object3D.getWorldPosition(currentPosition);
		deltaPosition.copy(startPoint).sub(currentPosition);
  
		// Apply panning.
		this.cameraRigEl.object3D.position.add(deltaPosition);
		this.cameraRigEl.setAttribute('position', this.cameraRigEl.object3D.position);
	  };
	})(),
  
	registerHand: function (entity, hand) {
	  this.controllers[hand].entity = entity;
	  entity.addEventListener(this.data.onStart, this.onButtonDown.bind(this));
	  entity.addEventListener(this.data.onEnd, this.onButtonUp.bind(this));
  
	  if (hand === 'left') {
		this.leftHandEl = entity;
	  } else {
		this.rightHandEl = entity;
	  }
	}
  });
  
	  AFRAME.registerComponent('camera-transform-controls-hand', {
		schema: {
		  hand: {default: 'right'}
		},
  
		play: function () {
		  this.el.sceneEl.components['camera-transform-controls'].registerHand(this.el, this.data.hand);
		}
	  });
  