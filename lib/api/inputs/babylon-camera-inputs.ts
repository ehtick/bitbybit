import * as BABYLON from "@babylonjs/core";
import { Base } from "./base-inputs";

/* eslint-disable @typescript-eslint/no-namespace */
export namespace BabylonCamera {
    export class ArcRotateCameraDto {
        constructor(radius?: number, alpha?: number, beta?: number, lowerRadiusLimit?: number, upperRadiusLimit?: number, lowerAlphaLimit?: number, upperAlphaLimit?: number, lowerBetaLimit?: number, upperBetaLimit?: number, angularSensibilityX?: number, angularSensibilityY?: number, panningSensibility?: number, wheelPrecision?: number, maxZ?: number) {
            if (radius !== undefined) { this.radius = radius; }
            if (alpha !== undefined) { this.alpha = alpha; }
            if (beta !== undefined) { this.beta = beta; }
            if (lowerRadiusLimit !== undefined) { this.lowerRadiusLimit = lowerRadiusLimit; }
            if (upperRadiusLimit !== undefined) { this.upperRadiusLimit = upperRadiusLimit; }
            if (lowerAlphaLimit !== undefined) { this.lowerAlphaLimit = lowerAlphaLimit; }
            if (upperAlphaLimit !== undefined) { this.upperAlphaLimit = upperAlphaLimit; }
            if (lowerBetaLimit !== undefined) { this.lowerBetaLimit = lowerBetaLimit; }
            if (upperBetaLimit !== undefined) { this.upperBetaLimit = upperBetaLimit; }
            if (angularSensibilityX !== undefined) { this.angularSensibilityX = angularSensibilityX; }
            if (angularSensibilityY !== undefined) { this.angularSensibilityY = angularSensibilityY; }
            if (panningSensibility !== undefined) { this.panningSensibility = panningSensibility; }
            if (wheelPrecision !== undefined) { this.wheelPrecision = wheelPrecision; }
            if (maxZ !== undefined) { this.maxZ = maxZ; }
        }
        /**
         * Defines the camera distance from its target. This radius will be used to rotate the camera around the target as default.
         * @default 20
         * @minimum 0
         * @maximum Infinity
         * @step 1
         */
        radius = 20;
        /**
         * Target of the arc rotate camera. Camera will look at and rotate around this point by default.
         * @default [0, 0, 0]
         */
        target: Base.Point3 = [0, 0, 0];
        /**
         * Defines the camera rotation along the longitudinal (horizontal) axis in degrees
         * @default 45
         * @minimum -360
         * @maximum 360
         * @step 1
         */
        alpha = 45;
        /**
         * Defines the camera rotation along the latitudinal (vertical) axis in degrees. This is counted from top down, where 0 is looking from top straight down.
         * @default 70
         * @minimum -360
         * @maximum 360
         * @step 1
         */
        beta = 70;
        /**
         * Lower radius limit - how close can the camera be to the target
         * @default undefined
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         * @optional true
         */
        lowerRadiusLimit;
        /**
         * Upper radius limit - how far can the camera be from the target
         * @default undefined
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         * @optional true
         */
        upperRadiusLimit;
        /**
         * Lower alpha limit - camera rotation along the longitudinal (horizontal) axis in degrees.
         * @default undefined
         * @minimum -360
         * @maximum 360
         * @step 1
         * @optional true
         */
        lowerAlphaLimit;
        /**
         * Upper alpha limit - camera rotation along the longitudinal (horizontal) axis in degrees.
         * @default undefined
         * @minimum -360
         * @maximum 360
         * @step 1
         * @optional true
         */
        upperAlphaLimit;
        /**
         * Lower beta limit - camera rotation along the latitudinal (vertical) axis in degrees. This is counted from the top down, where 0 is looking from top straight down.
         * @default 1
         * @minimum -360
         * @maximum 360
         * @step 1
         */
        lowerBetaLimit = 1;
        /**
         * Upper beta limit - camera rotation along the longitudinal (vertical) axis in degrees. This is counted from the top down, where 180 is looking from bottom straight up.
         * @default 179
         * @minimum -360
         * @maximum 360
         * @step 1
         */
        upperBetaLimit = 179;
        /**
         * Angular sensibility along x (horizontal) axis of the camera
         * @default 1000
         * @minimum 0
         * @maximum Infinity
         * @step 10
         */
        angularSensibilityX = 1000;
        /**
         * Angular sensibility along y (vertical) axis of the camera
         * @default 1000
         * @minimum 0
         * @maximum Infinity
         * @step 10
         */
        angularSensibilityY = 1000;
        /**
         * Panning sensibility. The lower this number gets the faster camera will move when panning.
         * @default 1000
         * @minimum 0
         * @maximum Infinity
         * @step 100
         */
        panningSensibility = 1000;
        /**
         * Wheel precision. The lower this number gets the faster camera will move when zooming.
         * @default 3
         * @minimum 0
         * @maximum Infinity
         * @step 0.1
         */
        wheelPrecision = 3;
        /**
         * Maximum distance the camera can see. Objects that are further away from the camera than this value will not be rendered.
         * @default 1000
         * @minimum 0
         * @maximum Infinity
         * @step 10
         */
        maxZ = 1000;
    }
    export class FreeCameraDto {
        constructor(position?: Base.Point3, target?: Base.Point3) {
            if (position !== undefined) { this.position = position; }
            if (target !== undefined) { this.target = target; }
        }
        /**
         * Position of the free camera
         * @default [20, 20, 20]
         */
        position: Base.Point3 = [20, 20, 20];
        /**
         * Target of the free camera
         * @default [0, 0, 0]
         */
        target: Base.Point3 = [0, 0, 0];
    }
    export class TargetCameraDto {
        constructor(position?: Base.Point3, target?: Base.Point3) {
            if (position !== undefined) { this.position = position; }
            if (target !== undefined) { this.target = target; }
        }
        /**
         * Position of the free camera
         * @default [20, 20, 20]
         */
        position: Base.Point3 = [20, 20, 20];
        /**
         * Target of the free camera
         * @default [0, 0, 0]
         */
        target: Base.Point3 = [0, 0, 0];
    }
    export class PositionDto {
        constructor(camera?: BABYLON.TargetCamera, position?: Base.Point3) {
            if (camera !== undefined) { this.camera = camera; }
            if (position !== undefined) { this.position = position; }
        }
        /**
         * Target camera
         */
        camera: BABYLON.TargetCamera;
        /**
         * Position of the free camera
         * @default [20, 20, 20]
         */
        position: Base.Point3 = [20, 20, 20];
    }
    export class SpeedDto {
        constructor(camera?: BABYLON.TargetCamera, speed?: number) {
            if (camera !== undefined) { this.camera = camera; }
            if (speed !== undefined) { this.speed = speed; }
        }
        /**
         * Target camera
         */
        camera: BABYLON.TargetCamera;
        /**
         * speed of the camera
         * @default 1
         * @minimum 0
         * @maximum Infinity
         * @step 0.1
         */
        speed = 1;
    }
    export class TargetDto {
        constructor(camera?: BABYLON.TargetCamera, target?: Base.Point3) {
            if (camera !== undefined) { this.camera = camera; }
            if (target !== undefined) { this.target = target; }
        }
        /**
         * Target camera
         */
        camera: BABYLON.TargetCamera;
        /**
         * target of the camera
         * @default [0, 0, 0]
         */
        target: Base.Point3 = [0, 0, 0];
    }
    export class MinZDto {
        constructor(camera?: BABYLON.Camera, minZ?: number) {
            if (camera !== undefined) { this.camera = camera; }
            if (minZ !== undefined) { this.minZ = minZ; }
        }
        /**
         * Free camera
         */
        camera: BABYLON.Camera;
        /**
         * minZ of the camera
         * @default 0
         * @minimum 0
         * @maximum Infinity
         * @step 0.01
         */
        minZ = 0;
    }
    export class MaxZDto {
        constructor(camera?: BABYLON.Camera, maxZ?: number) {
            if (camera !== undefined) { this.camera = camera; }
            if (maxZ !== undefined) { this.maxZ = maxZ; }
        }
        /**
         * Free camera
         */
        camera: BABYLON.Camera;
        /**
         * maxZ of the camera
         * @default 1000
         * @minimum 0
         * @maximum Infinity
         * @step 1
         */
        maxZ = 1000;
    }

    export class OrthographicDto {
        constructor(camera?: BABYLON.Camera, orthoLeft?: number, orthoRight?: number, orthoTop?: number, orthoBottom?: number) {
            if (camera !== undefined) { this.camera = camera; }
            if (orthoLeft !== undefined) { this.orthoLeft = orthoLeft; }
            if (orthoRight !== undefined) { this.orthoRight = orthoRight; }
            if (orthoTop !== undefined) { this.orthoTop = orthoTop; }
            if (orthoBottom !== undefined) { this.orthoBottom = orthoBottom; }
        }
        /**
         * Camera to adjust
         */
        camera: BABYLON.Camera;
        /**
         * Left side limit of the orthographic camera
         * @default -1
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         */
        orthoLeft = -1;
        /**
         * Right side limit of the orthographic camera
         * @default 1
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         */
        orthoRight = 1;
        /**
         * Bottom side limit of the orthographic camera
         * @default -1
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         */
        orthoBottom = -1;
        /**
         * Top side limit of the orthographic camera
         * @default 1
         * @minimum -Infinity
         * @maximum Infinity
         * @step 1
         */
        orthoTop = 1;
    }

    export class CameraDto {
        constructor(camera?: BABYLON.Camera) {
            if (camera !== undefined) { this.camera = camera; }
        }
        /**
         * Camera
         */
        camera: BABYLON.Camera;
    }
}
