// All from: https://github.com/aframevr/a-painter/tree/master


AFRAME.registerBrush("mySphere", {

  init: function (color, width) {
    // Initialize the material based on the stroke color.
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color( 'skyblue' ),
      roughness: 0.5,
      metalness: 0,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.geometry = new THREE.SphereGeometry(1, 3, 2);
  
    this.data = {
        points: [],
        size: brushSize,
        prevPosition: null,
        prevPointerPosition: null,
        numPoints: 0,
        maxPoints: 1000,
        color: color.clone()
      };

    },

    addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {

      // Create a new sphere mesh to insert at the given position.
      var sphere = new THREE.Mesh(this.geometry, this.material);

      // The scale is determined by the trigger pressure.
      var scale = 1.0;
      // var scale = this.data.size / 2 * pressure;
      sphere.scale.set(scale, scale, scale);
      sphere.initialScale = sphere.scale.clone();

      // Generate a random phase to be used in the tick animation.
      // sphere.phase = Math.random() * Math.PI * 2;

      // Set the position and orientation of the sphere to match
      // the controllers.
      sphere.position.copy(pointerPosition);
      sphere.rotation.copy(orientation);

      // Add the sphere to the `object3D`.
      this.object3D.add(sphere);

      // Return `true`, since we've correctly added a new point (sphere).
      return true;

    },


    tick: function (timeOffset, delta) {}
  }  , options);
