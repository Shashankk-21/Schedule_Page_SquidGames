# 3D Model Integration Guide for Squid Game Characters

This guide explains how to integrate your 3D character models (`.obj`, `.fbx`) into the existing `ThreeBackground.jsx` scene.

## Prerequisites

The project currently uses **vanilla Three.js** (not React Three Fiber components) within a React `useEffect`. We will use the `GLTFLoader` to bring your models into the scene.

## Step 1: Convert Models to GLB (Recommended)

For the best performance and ease of use on the web, it is highly recommended to convert your `.obj` or `.fbx` files to the **glTF Binary (`.glb`)** format. This bundles textures and mesh data into a single file.

1.  **Online Converter:**
    *   Visit [Aspose 3D Converter](https://products.aspose.app/3d/conversion) or any online FBX/OBJ to GLB converter.
    *   Upload your `.fbx` or `.obj` (and `.mtl` + textures if using OBJ).
    *   Convert to `glb`.

2.  **Using Blender (Best for control):**
    *   Import your `.fbx` or `.obj` into Blender.
    *   Ensure textures are correctly applied.
    *   Go to `File > Export > glTF 2.0 (.glb)`.
    *   Ensure "Include > Textures" is checked if needed.

## Step 2: Place the File

1.  Create a folder named `models` inside the `public/` directory of your project (if it doesn't exist).
2.  Place your converted `character.glb` (or whatever you named it) into `public/models/`.

## Step 3: Update `ThreeBackground.jsx`

You need to import the `GLTFLoader` and add code to load the model.

### 1. Add the Import

At the top of `src/ThreeBackground.jsx`, add:

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
```

### 2. Load the Model

Inside the `useEffect` hook in `ThreeBackground.jsx`, locate the section where objects are added to the scene (around where `tunnelGrp` or `barGrp` are created). Add the following code:

```javascript
    // ─── LOAD CHARACTER MODEL ─────────────────────────
    const loader = new GLTFLoader();

    loader.load(
      '/models/character.glb', // Path to your file in public/
      (gltf) => {
        const model = gltf.scene;

        // Adjust scale (trial and error might be needed)
        model.scale.set(5, 5, 5);

        // Adjust position
        model.position.set(0, -10, -20); // x, y, z

        // Optional: Rotate it
        model.rotation.y = Math.PI; // Face forward if needed

        // Enable shadows if you have lights (optional)
        model.traverse((child) => {
          if (child.isMesh) {
            // Apply materials or colors if needed
            // child.material.emissive = new THREE.Color(0xff0050);
            // child.material.emissiveIntensity = 0.2;
          }
        });

        // Add to the scene or a specific group
        scene.add(model);

        // Animation (if the model has animations)
        // const mixer = new THREE.AnimationMixer(model);
        // gltf.animations.forEach((clip) => {
        //   mixer.clipAction(clip).play();
        // });
        // You would then need to update 'mixer' in the 'tick' function:
        // if (mixer) mixer.update(clock.getDelta());
      },
      undefined, // onProgress
      (error) => {
        console.error('An error happened loading the model:', error);
      }
    );
```

## Step 4: Troubleshooting

*   **Model is black?**
    *   The current scene might not have lights that affect the model, or the material is not reactive to the existing lighting.
    *   Try adding a generic light for testing:
        ```javascript
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        ```
    *   Or change the material to `MeshBasicMaterial` in the traverse loop to make it self-illuminated (cartoon style):
        ```javascript
        child.material = new THREE.MeshBasicMaterial({
            map: child.material.map,
            color: child.material.color
        });
        ```

*   **Model is too small/large?**
    *   Adjust `model.scale.set(x, y, z)`.

*   **Model is floating?**
    *   Adjust `model.position.y`. The floor in the current scene is around `y = -12`.

## Using multiple models

If you have the 4 different files (Guard, Doll, etc.), repeat the loading process for each, giving them different positions in the scene (e.g., one at `x: -10`, one at `x: 10`).
