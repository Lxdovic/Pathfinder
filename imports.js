import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/MTLLoader.js'
import { TGALoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/TGALoader.js'
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/OBJLoader.js'
import { STLLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/STLLoader.js'
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/TransformControls.js'
import { MapControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/UnrealBloomPass.js'
import { HalftonePass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/HalftonePass.js'
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/shaders/ColorCorrectionShader.js'
import { OutlinePass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/shaders/FXAAShader.js';
import { Line2 } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/lines/LineGeometry.js';
import * as GeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/GeometryUtils.js';


export {
    THREE,
    Line2,
    LineMaterial,
    LineGeometry,
    GeometryUtils,
    MTLLoader,
    TGALoader,
    GLTFLoader,
    OBJLoader,
    STLLoader,
    FBXLoader,
    DRACOLoader,
    OrbitControls,
    TransformControls,
    MapControls,
    EffectComposer,
    RenderPass,
    UnrealBloomPass, 
    ShaderPass,
    CopyShader,
    FXAAShader,
    HalftonePass,
    ColorCorrectionShader,
    OutlinePass
}