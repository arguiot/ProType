const COLORS = {
    red: 0xf54843,
    green: 0x43f565,
    yellow: 0xeff543,
};

const SCENE_CONFIG = {
    pathRadius: 4,
    pathAnimationDuration: 20,
    cameraSpeed: 14.079549454417457,
};

const NEXT_PATH_MATRIX = new THREE.Matrix4().multiplyMatrices(
    new THREE.Matrix4().makeTranslation(0, 0, -8),
    new THREE.Matrix4().makeScale(-1, -1, 1)
);

let root;
let tubes = [];
let cameraTween;

window.onload = () => {
	root = new THREERoot({
		createCameraControls: false,
		antialias: true, //(window.devicePixelRatio === 1),
		fov: 80,
		zNear: 0.001,
		zFar: 2000,
	});

	root.renderer.setClearColor(new THREE.Color().setHSL(0, 0, 0.05));
	root.camera.position.set(0, 0.05, 1);

	createTubes();
	beginTubesSequence();
}

// METHODS

function createTubes() {
    const matrix = new THREE.Matrix4();

    matrix.makeRotationZ(Math.PI * 0.00);
    tubes[0] = createPathMesh(matrix);

    matrix.makeRotationZ(Math.PI * 0.66);
    tubes[1] = createPathMesh(matrix);

    matrix.makeRotationZ(Math.PI * 1.32);
    tubes[2] = createPathMesh(matrix);
}

function beginTubesSequence() {
    // BLOOM

    const strength = 1.25; // 0 - x
    const radius = 1.0; // 0 - 1
    const threshold = 0.5; // 0 - 1
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        strength,
        radius,
        threshold
    );
    const copyPass = new THREE.ShaderPass(THREE.CopyShader);

    root.initPostProcessing([
        bloomPass,
        copyPass
    ]);

    // LIGHT

    light = new THREE.DirectionalLight(COLORS.red, 1);
    light.position.set(1, 0, 0);
    root.add(light);

    light = new THREE.DirectionalLight(COLORS.green, 1);
    light.position.set(-1, 0, 0);
    root.add(light);

    light = new THREE.DirectionalLight(COLORS.red, 1);
    light.position.set(0, 0, 1);
    root.add(light);

    // CAMERA ROTATION

    let cameraPanRange = 1.0,
        cameraYawRange = cameraPanRange * 1.125;

    window.addEventListener('mousemove', (e) => {
        const nx = e.clientX / window.innerWidth * 2 - 1;
        const ny = -e.clientY / window.innerHeight * 2 + 1;
        const ry = -THREE.Math.mapLinear(nx, -1, 1, cameraPanRange * -0.5, cameraPanRange * 0.5);
        const rx = THREE.Math.mapLinear(ny, -1, 1, cameraYawRange * -0.5, cameraYawRange * 0.5);

        TweenMax.to(root.camera.rotation, 1, {
            x: rx,
            y: ry,
            ease: Power2.easeOut,
        });
    });

    // CAMERA MOVEMENT

    const tweenCamera = () => {
        cameraTween = TweenMax.to(root.camera.position, SCENE_CONFIG.cameraSpeed, {
            z: `-=${SCENE_CONFIG.pathRadius * 2}`,
            ease: Power0.easeIn,
            onComplete: tweenCamera
        });
    };

    tweenCamera();

    cameraTween.timeScale(0);

    const proxy = {
        rx: 0,
        ry: 0,
        rz: 0,
        cz: 0,
    };
    const camTL = new TimelineMax();

    camTL.to(proxy, 4, {
        rz: 1,
        cz: 1,
        ease: Power2.easeIn,
        onUpdate: () => {
            cameraTween.timeScale(proxy.cz);
        }
    }, 0);

    root.addUpdateCallback(() => {
        root.scene.rotation.z -= proxy.rz * 0.003;
    });

    // WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

    tubes.forEach((tube) => {
        root.add(tube);
        advanceTube(tube);
    });
}

function advanceTube(tube) {
    const tl = new TimelineMax();
    const firstCompleteTime = tube.geometry.firstCompleteTime * tube.__config.duration;

    //        if (firstCompleteTime > SCENE_CONFIG.cameraSpeed) {
    //          console.log('>>>>>>', firstCompleteTime, SCENE_CONFIG.cameraSpeed);
    //        }

    tl.add(tube.animate(tube.__config.duration, {
        ease: Power0.easeInOut
    }));
    tl.add(() => {
        const transformMatrix = new THREE.Matrix4().multiplyMatrices(
            tube.__pathMatrix,
            NEXT_PATH_MATRIX
        );

        const nextTube = createPathMesh(transformMatrix, {
            tubeCount: tube.__config.tubeCount,
            tubeArcLength: tube.__config.tubeArcLength,
            tubeStagger: tube.__config.tubeStagger
        });

        root.add(nextTube);
        advanceTube(nextTube);

    }, firstCompleteTime);

    tl.add(() => {
        root.remove(tube);
        tube.geometry.dispose();
        tube.material.dispose();
    });
}

function createPath() {
    let length = 16;
    let path = [];
    let point = new THREE.Vector3();

    for (let i = 0; i < length; i++) {
        let angle = i / (length - 1) * Math.PI - Math.PI * 1.5;
        let radius = SCENE_CONFIG.pathRadius;

        let scaleX = THREE.Math.mapLinear(i, 0, length - 1, 0.75, 0.25) * THREE.Math.randFloat(0.6, 1.0);

        point.x = Math.cos(angle) * radius * scaleX;
        point.z = Math.sin(angle) * radius - radius;
        point.y = (i === 0 || i === length - 1) ? 0 : THREE.Math.randFloatSpread(2) * (i / length);
        // point.y = 0;

        let twistOffset = (i === 0 || i === length - 1) ? 0 : THREE.Math.randFloatSpread(2);
        // let twistOffset = 0;

        path.push(new THREE.Vector4(point.x, point.y, point.z, twistOffset));
    }

    return path;
}

function createPathMesh(matrix, cfg) {
    const config = Object.assign({},
        cfg, {
            tubeSegments: 128,
            // tubeCount: THREE.Math.randInt(32, 48),
            // tubeArcLength: THREE.Math.randFloat(0.15, 0.3),
            // tubeStagger: THREE.Math.randFloat(0.0002, 0.002),

            tubeCount: 32,
            tubeArcLength: 0.25,
            tubeStagger: 0.001,

            tubeRadius: THREE.Math.randFloat(0.005, 0.01),
            twistDistance: THREE.Math.randFloat(0.1, 1.5),
            twistAngle: Math.PI * THREE.Math.randFloat(2, 16),
            duration: SCENE_CONFIG.pathAnimationDuration,

            path: createPath()
        }
    );

    const mesh = new Tubes(config);

    mesh.applyMatrix(matrix);
    mesh.__pathMatrix = matrix.clone();
    mesh.__config = config;

    return mesh;
}

// CLASSES

function Tubes(config) {
    const geometry = new TubesGeometry(config);

    const material = new THREE.BAS.StandardAnimationMaterial({
        shading: THREE.FlatShading,
        defines: {
            ROBUST: false,
            TUBE_LENGTH_SEGMENTS: config.tubeSegments.toFixed(1),
            PATH_LENGTH: config.path.length,
            PATH_MAX: (config.path.length - 1).toFixed(1)
        },

        uniforms: {
            thickness: {
                value: config.tubeRadius
            },
            uTwist: {
                value: new THREE.Vector2(
                    config.twistDistance,
                    config.twistAngle
                )
            },
            time: {
                value: 0.0
            },
            uPath: {
                value: config.path
            }
        },

        uniformValues: {
            diffuse: new THREE.Color(COLORS.yellow),
            roughness: .75,
            metalness: .0
        },

        vertexParameters: [
            THREE.BAS.ShaderChunk['catmull_rom_spline'],

            `
      attribute vec2 aAngle;
      attribute float aTwistOffset;

      uniform float thickness;
      uniform float time;
      uniform vec2 uTwist;
      uniform vec4 uPath[PATH_LENGTH];

      varying float vProgress;

      // Some constants for the robust version
      #ifdef ROBUST
        const float MAX_NUMBER = 1.79769313e+32;
      #endif

      vec3 sample(float t) {

        float pathProgress = t * PATH_MAX;

        ivec4 indices = getCatmullRomSplineIndices(PATH_MAX, pathProgress);

        vec4 p0 = uPath[indices[0]];
        vec4 p1 = uPath[indices[1]];
        vec4 p2 = uPath[indices[2]];
        vec4 p3 = uPath[indices[3]];

        float angle = t * uTwist.y;
        float ca = cos(angle);
        float sa = sin(angle);
        vec3 offset = vec3(ca, sa * ca, sa) * aTwistOffset * uTwist.x;

        return catmullRomSpline(
          p0.xyz + offset * p0.w,
          p1.xyz + offset * p1.w,
          p2.xyz + offset * p2.w,
          p3.xyz + offset * p3.w,
          fract(pathProgress)
        );
      }

      #ifdef ROBUST
      // ------
      // Robust handling of Frenet-Serret frames with Parallel Transport
      // ------
      vec3 getTangent (vec3 a, vec3 b) {
        return normalize(b - a);
      }

      void rotateByAxisAngle (inout vec3 normal, vec3 axis, float angle) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized
        float halfAngle = angle / 2.0;
        float s = sin(halfAngle);
        vec4 quat = vec4(axis * s, cos(halfAngle));
        normal = normal + 2.0 * cross(quat.xyz, cross(quat.xyz, normal) + quat.w * normal);
      }

      void createTube (float t, vec2 volume, out vec3 outPosition) {
        // Reference:
        // https://github.com/mrdoob/three.js/blob/b07565918713771e77b8701105f2645b1e5009a7/src/extras/core/Curve.js#L268

        // find first tangent
        vec3 point0 = sample(0.0);
        vec3 point1 = sample(1.0 / TUBE_LENGTH_SEGMENTS);

        vec3 lastTangent = getTangent(point0, point1);
        vec3 absTangent = abs(lastTangent);
        vec3 tmpNormal = vec3(1.0, 0.0, 0.0);
        vec3 tmpVec = normalize(cross(lastTangent, tmpNormal));
        vec3 lastNormal = cross(lastTangent, tmpVec);
        vec3 lastBinormal = cross(lastTangent, lastNormal);
        vec3 lastPoint = point0;

        vec3 normal;
        vec3 tangent;
        vec3 binormal;
        vec3 point;
        float maxLen = (TUBE_LENGTH_SEGMENTS - 1.0);
        float epSq = EPSILON * EPSILON;
        for (float i = 1.0; i < TUBE_LENGTH_SEGMENTS; i += 1.0) {
          float u = i / maxLen;
          // could avoid additional sample here at expense of ternary
          // point = i == 1.0 ? point1 : sample(u);
          point = sample(u);
          tangent = getTangent(lastPoint, point);
          normal = lastNormal;
          binormal = lastBinormal;

          tmpVec = cross(lastTangent, tangent);
          if ((tmpVec.x * tmpVec.x + tmpVec.y * tmpVec.y + tmpVec.z * tmpVec.z) > epSq) {
            tmpVec = normalize(tmpVec);
            float tangentDot = dot(lastTangent, tangent);
            float theta = acos(clamp(tangentDot, -1.0, 1.0)); // clamp for floating pt errors
            rotateByAxisAngle(normal, tmpVec, theta);
          }

          binormal = cross(tangent, normal);
          if (u >= t) break;

          lastPoint = point;
          lastTangent = tangent;
          lastNormal = normal;
          lastBinormal = binormal;
        }

        // extrude outward to create a tube
        float circX = aAngle.x;
        float circY = aAngle.y;

        // compute the TBN matrix
        vec3 T = tangent;
        vec3 B = binormal;
        vec3 N = -normal;

        // extrude the path & create a new normal
        outPosition.xyz = point + B * volume.x * circX + N * volume.y * circY;
      }
      #else


      // ------
      // Fast version; computes the local Frenet-Serret frame
      // ------
      void createTube (float t, vec2 volume, out vec3 offset) {
        // find next sample along curve
        // float nextT = t + (1.0 / TUBE_LENGTH_SEGMENTS) * fract(time * TUBE_LENGTH_SEGMENTS);
        float nextT = t + (1.0 / TUBE_LENGTH_SEGMENTS);

        // sample the curve in two places
        vec3 current = sample(t);
        vec3 next = sample(nextT);

        // compute the TBN matrix
        vec3 T = normalize(next - current);
        vec3 B = normalize(cross(T, next + current));
        vec3 N = -normalize(cross(B, T));

        // extrude outward to create a tube
        float circX = aAngle.x;
        float circY = aAngle.y;

        float a = length(cross(next, current));

        volume *= 0.5 + a * a * 0.5;

        // compute position and normal
        offset.xyz = current + B * volume.x * circX + N * volume.y * circY;
      }
      #endif
      `
        ],

        fragmentParameters: [
            `varying float vProgress;`
        ],

        vertexPosition: [
            `
      float t = position.x;

      t = clamp(t + time, 0.0, 1.0);

      vec2 volume = vec2(thickness);
      vec3 tTransformed;

      createTube(t, volume, tTransformed);
      transformed = tTransformed;

      vProgress = t;
      `
        ],

        fragmentInit: [
            `if (vProgress == 0.0 || vProgress == 1.0) discard;`
        ]
    });

    THREE.Mesh.call(this, geometry, material);

    this.frustumCulled = false;
}
Tubes.prototype = Object.create(THREE.Mesh.prototype);
Tubes.prototype.constructor = Tubes;

Object.defineProperty(Tubes.prototype, 'time', {
    get: function() {
        return this.material.uniforms['time'].value;
    },
    set: function(v) {
        this.material.uniforms['time'].value = v;
    }
});

Tubes.prototype.animate = function(duration, options) {
    options = options || {};
    options.time = this.geometry.totalDuration;

    return TweenMax.fromTo(this, duration, {
        time: 0.0
    }, options);
};

function TubesGeometry(config) {
    const radius = 1;
    const length = config.tubeArcLength;
    const sides = 6;
    const segments = config.tubeSegments;
    const openEnded = false;
    const prefab = new THREE.CylinderGeometry(radius, radius, length, sides, segments, openEnded);

    prefab.rotateZ(Math.PI / 2);

    this.tubeLength = length;
    this.tubeStagger = config.tubeStagger;

    THREE.BAS.PrefabBufferGeometry.call(this, prefab, config.tubeCount);

    let aAngle = this.createAttribute('aAngle', 2);
    let tmp = new THREE.Vector2();

    for (let i = 0, offset = 0; i < config.tubeCount; i++) {
        for (let j = 0; j < prefab.vertices.length; j++) {
            let v = prefab.vertices[j];

            tmp.set(v.y, v.z).normalize();

            let angle = Math.atan2(tmp.y, tmp.x);

            aAngle.array[offset++] = Math.cos(angle); // angle x
            aAngle.array[offset++] = Math.sin(angle); // angle y
        }
    }

    // const offset = Math.random() * 2 - 1;
    const offset = 0;

    this.createAttribute('aTwistOffset', 1, (data, i, count) => {
        data[0] = THREE.Math.mapLinear(i, 0, count - 1, -1, 1) + offset;
    });
}
TubesGeometry.prototype = Object.create(THREE.BAS.PrefabBufferGeometry.prototype);
TubesGeometry.prototype.constructor = TubesGeometry;

TubesGeometry.prototype.bufferPositions = function() {
    let positionBuffer = this.createAttribute('position', 3).array;

    let matrix = new THREE.Matrix4();
    let p = new THREE.Vector3();

    let tubeLength, tubeTimeOffset;

    for (let i = 0, offset = 0; i < this.prefabCount; i++) {
        tubeLength = this.tubeLength + i * this.tubeStagger;
        tubeTimeOffset = i * this.tubeStagger;

        matrix.identity();
        matrix.makeTranslation(tubeLength * -0.5 - tubeTimeOffset, 0.0, 0.0);

        for (let j = 0; j < this.prefabVertexCount; j++, offset += 3) {
            let prefabVertex = this.prefabGeometry.vertices[j];

            p.copy(prefabVertex);
            p.applyMatrix4(matrix);

            positionBuffer[offset] = p.x;
            positionBuffer[offset + 1] = p.y;
            positionBuffer[offset + 2] = p.z;
        }
    }

    // todo simplify this..
    this.totalDuration = 1.0 - (tubeLength * -0.5 - tubeTimeOffset) + this.tubeLength - this.tubeStagger;
    this.firstCompleteTime = 1.0 / this.totalDuration;
};

function LineHelper(points, params) {
    let g = new THREE.Geometry();
    let m = new THREE.LineBasicMaterial(params);

    g.vertices = points;

    THREE.Line.call(this, g, m);
}

LineHelper.prototype = Object.create(THREE.Line.prototype);
LineHelper.prototype.constructor = LineHelper;


function THREERoot(params) {
    // defaults
    params = Object.assign({
        container: '#three-container',
        fov: 60,
        zNear: 1,
        zFar: 10000,
        createCameraControls: true,
        autoStart: true,
        pixelRatio: window.devicePixelRatio,
        antialias: (window.devicePixelRatio === 1),
        alpha: false
    }, params);

    // maps and arrays
    this.updateCallbacks = [];
    this.resizeCallbacks = [];
    this.objects = {};

    // renderer
    this.renderer = new THREE.WebGLRenderer({
        antialias: params.antialias,
        alpha: params.alpha
    });
    this.renderer.setPixelRatio(params.pixelRatio);

    // container
    this.container = (typeof params.container === 'string') ? document.querySelector(params.container) : params.container;
    this.container.appendChild(this.renderer.domElement);

    // camera
    this.camera = new THREE.PerspectiveCamera(
        params.fov,
        window.innerWidth / window.innerHeight,
        params.zNear,
        params.zFar
    );

    // scene
    this.scene = new THREE.Scene();

    // resize handling
    this.resize = this.resize.bind(this);
    this.resize();
    window.addEventListener('resize', this.resize, false);

    // tick / update / render
    this.tick = this.tick.bind(this);
    params.autoStart && this.tick();

    // optional camera controls
    params.createCameraControls && this.createOrbitControls();
}
THREERoot.prototype = {
    createOrbitControls: function() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.addUpdateCallback(this.controls.update.bind(this.controls));
    },
    start: function() {
        this.tick();
    },
    addUpdateCallback: function(callback) {
        this.updateCallbacks.push(callback);
    },
    addResizeCallback: function(callback) {
        this.resizeCallbacks.push(callback);
    },
    add: function(object, key) {
        key && (this.objects[key] = object);
        this.scene.add(object);
    },
    addTo: function(object, parentKey, key) {
        key && (this.objects[key] = object);
        this.get(parentKey).add(object);
    },
    get: function(key) {
        return this.objects[key];
    },
    remove: function(o) {
        var object;

        if (typeof o === 'string') {
            object = this.objects[o];
        } else {
            object = o;
        }

        if (object) {
            object.parent.remove(object);
            delete this.objects[o];
        }
    },
    tick: function() {
		this.interval = setInterval(() => {
			this.update();
	        this.render();
		}, 1000 / 24)
    },
    update: function() {
        this.updateCallbacks.forEach(function(callback) {
            callback()
        });
    },
    render: function() {
        this.renderer.render(this.scene, this.camera);
    },
    resize: function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.resizeCallbacks.forEach(function(callback) {
            callback()
        });
    },
    initPostProcessing: function(passes) {
        var size = this.renderer.getSize();
        var pixelRatio = this.renderer.getPixelRatio();
        size.width *= pixelRatio;
        size.height *= pixelRatio;

        var composer = this.composer = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(size.width, size.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        }));

        var renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        for (var i = 0; i < passes.length; i++) {
            var pass = passes[i];
            pass.renderToScreen = (i === passes.length - 1);
            this.composer.addPass(pass);
        }

        this.renderer.autoClear = false;
        this.render = function() {
            this.renderer.clear();
            this.composer.render();
        }.bind(this);

        this.addResizeCallback(function() {
            var width = window.innerWidth;
            var height = window.innerHeight;

            composer.setSize(width * pixelRatio, height * pixelRatio);
        }.bind(this));
    }
};
