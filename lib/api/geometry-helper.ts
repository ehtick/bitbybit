
import * as BABYLON from "@babylonjs/core";
import { Context } from "./context";
import * as Inputs from "./inputs";

export class GeometryHelper {

    constructor(private readonly context: Context) {
    }

    createOrUpdateSurfaceMesh(
        meshDataConverted: { positions: any[]; indices: any[]; normals: any[]; },
        mesh: BABYLON.Mesh, updatable: boolean, material: BABYLON.PBRMetallicRoughnessMaterial, addToScene: boolean, hidden: boolean
    ): BABYLON.Mesh {
        const createMesh = () => {
            const vertexData = new BABYLON.VertexData();
            vertexData.positions = meshDataConverted.positions;
            vertexData.indices = meshDataConverted.indices;
            vertexData.normals = meshDataConverted.normals;
            vertexData.applyToMesh(mesh, updatable);
        };

        if (mesh && updatable) {
            mesh.dispose();
            createMesh();
            mesh.flipFaces(false);
        } else {
            let scene = null;
            if (addToScene) {
                scene = this.context.scene;
            }
            mesh = new BABYLON.Mesh(`surface${Math.random()}`, scene);
            createMesh();
            mesh.flipFaces(false);
            if (material) {
                mesh.material = material;
            }
        }
        if (material) {
            mesh.material = material;
        }
        if (hidden) {
            mesh.isVisible = false;
        }
        mesh.isPickable = false;
        return mesh;
    }

    createOrUpdateSurfacesMesh(
        meshDataConverted: { positions: number[]; indices: number[]; normals: number[]; uvs: number[] }[],
        mesh: BABYLON.Mesh, updatable: boolean, material: BABYLON.PBRMetallicRoughnessMaterial, addToScene: boolean, hidden: boolean
    ): BABYLON.Mesh {
        const createMesh = () => {
            const first = meshDataConverted.pop();
            const vd = new BABYLON.VertexData();
            vd.positions = first.positions;
            vd.indices = first.indices;
            vd.normals = first.normals;
            vd.uvs = first.uvs;

            const v = [];
            meshDataConverted.forEach(meshData => {
                const vertexData = new BABYLON.VertexData();
                vertexData.positions = meshData.positions;
                vertexData.indices = meshData.indices;
                vertexData.normals = meshData.normals;
                vertexData.uvs = meshData.uvs;
                v.push(vertexData);
            });
            vd.merge(v);
            vd.applyToMesh(mesh, updatable);
        };

        if (mesh && updatable) {
            mesh.dispose();
            createMesh();
            mesh.flipFaces(false);
        } else {
            let scene = null;
            if (addToScene) {
                scene = this.context.scene;
            }
            mesh = new BABYLON.Mesh(`surface${Math.random()}`, scene);
            createMesh();
            mesh.flipFaces(false);
            if (material) {
                mesh.material = material;
            }
        }
        if (material) {
            mesh.material = material;
        }
        if (hidden) {
            mesh.isVisible = false;
        }
        mesh.isPickable = false;
        return mesh;
    }

    transformControlPoints(transformation: number[][] | number[][][], transformedControlPoints: Inputs.Base.Point3[]): Inputs.Base.Point3[] {
        const transformationArrays = this.getFlatTransformations(transformation);

        transformationArrays.forEach(transform => {

            transformedControlPoints = this.transformPointsByMatrixArray(transformedControlPoints, transform);
        });
        return transformedControlPoints;
    }

    getFlatTransformations(transformation: number[][] | number[][][]): number[][] {
        let transformationArrays = [];

        if (this.getArrayDepth(transformation) === 3) {
            transformation.forEach(transform => {
                transformationArrays.push(...transform);
            });
        } else {
            transformationArrays = transformation;
        }
        return transformationArrays;
    }

    getArrayDepth = (value): number => {
        return Array.isArray(value) ?
            1 + Math.max(...value.map(this.getArrayDepth)) :
            0;
    };

    transformPointsByMatrixArray(points: Inputs.Base.Point3[], transform: number[]): Inputs.Base.Point3[] {
        const transformMatrix = BABYLON.Matrix.FromArray(transform);
        return this.transformPointsByMatrix(points, transformMatrix);
    }

    transformPointsByMatrix(points: Inputs.Base.Point3[], transformMatrix: BABYLON.Matrix): Inputs.Base.Point3[] {
        const transformedPoints = [];
        for (const pt of points) {
            const vector = new BABYLON.Vector3(pt[0], pt[1], pt[2]);
            const transformedVector = BABYLON.Vector3.TransformCoordinates(vector, transformMatrix);
            transformedPoints.push([transformedVector.x, transformedVector.y, transformedVector.z]);
        }
        return transformedPoints;
    }

    edgesRendering(mesh: BABYLON.LinesMesh, size: number, opacity: number, colours: string | string[]): void {
        mesh.enableEdgesRendering();
        mesh.edgesWidth = size;
        const colour = Array.isArray(colours) ? BABYLON.Color3.FromHexString(colours[0]) : BABYLON.Color3.FromHexString(colours);
        const edgeColor = colour;
        mesh.color = edgeColor;
        mesh.edgesColor = new BABYLON.Color4(edgeColor.r, edgeColor.g, edgeColor.b, opacity);
    }

    drawPolyline(mesh: BABYLON.GreasedLineMesh,
        pointsToDraw: number[][],
        updatable: boolean, size: number, opacity: number, colours: string | string[]): BABYLON.GreasedLineMesh {
        mesh = this.drawPolylines(mesh, [pointsToDraw], updatable, size, opacity, colours);
        return mesh;
    }

    drawPolylines(
        mesh: BABYLON.GreasedLineMesh, polylinePoints: number[][][], updatable: boolean,
        size: number, opacity: number, colours: string | string[]
    ): BABYLON.GreasedLineMesh | undefined {
        const linesForRender: number[][] = [];
        if (polylinePoints && polylinePoints.length > 0) {
            polylinePoints.forEach(polyline => {
                const points = polyline.map(p => p.length === 2 ? [p[0], p[1], 0] : p);
                linesForRender.push(points.flat());
            });
            const width = size / 100;
            const color = Array.isArray(colours) ? BABYLON.Color3.FromHexString(colours[0]) : BABYLON.Color3.FromHexString(colours);

            if (mesh && updatable) {
                // in order to optimize this method its not enough to check if total vertices lengths match, we need a way to identify
                if (!mesh?.metadata?.linesForRenderLengths.some((s, i) => s !== linesForRender[i].length)) {
                    mesh.setPoints(linesForRender);
                    return mesh as BABYLON.GreasedLineMesh;
                } else {
                    mesh.dispose();
                    mesh = this.createGreasedPolylines(updatable, linesForRender, width, color, opacity);
                    mesh.metadata = { linesForRenderLengths: linesForRender.map(l => l.length) };
                }
            } else {
                mesh = this.createGreasedPolylines(updatable, linesForRender, width, color, opacity);
                mesh.metadata = { linesForRenderLengths: linesForRender.map(l => l.length) };
            }

            return mesh;
        } else {
            return undefined;
        }
    }

    createGreasedPolylines(updatable: boolean, lines: number[][], width: number, color: BABYLON.Color3, visibility: number): BABYLON.GreasedLineMesh {
        const result = BABYLON.CreateGreasedLine(
            `lineSystem${Math.random()}`,
            {
                points: lines,
                updatable,
            },
            {
                width,
                color,

            },
            this.context.scene
        );
        result.material.alpha = visibility;
        return result as BABYLON.GreasedLineMesh;
    }
    
    // Algorithm works with arbitrary length numeric vectors. This algorithm is more costly for longer arrays of vectors
    removeAllDuplicateVectors(vectors: number[][], tolerance = 1e-7): number[][] {
        const cleanVectors: number[][] = [];
        vectors.forEach(vector => {
            // when there are no vectors in cleanVectors array that match the current vector, push it in.
            if (!cleanVectors.some(s => this.vectorsTheSame(vector, s, tolerance))) {
                cleanVectors.push(vector);
            }
        });
        return cleanVectors;
    }

    // Algorithm works with arbitrary length numeric vectors. 
    removeConsecutiveVectorDuplicates(vectors: number[][], checkFirstAndLast = true, tolerance = 1e-7): number[][] {
        const vectorsRemaining: number[][] = [];
        if (vectors.length > 1) {
            for (let i = 1; i < vectors.length; i++) {
                const currentVector = vectors[i];
                const previousVector = vectors[i - 1];
                if (!this.vectorsTheSame(currentVector, previousVector, tolerance)) {
                    vectorsRemaining.push(previousVector);
                }
                if (i === vectors.length - 1) {
                    vectorsRemaining.push(currentVector);
                }
            }
            if (checkFirstAndLast) {
                const firstVector = vectorsRemaining[0];
                const lastVector = vectorsRemaining[vectorsRemaining.length - 1];
                if (this.vectorsTheSame(firstVector, lastVector, tolerance)) {
                    vectorsRemaining.pop();
                }
            }
        } else if (vectors.length === 1) {
            vectorsRemaining.push(...vectors);
        }
        return vectorsRemaining;
    }

    vectorsTheSame(vec1: number[], vec2: number[], tolerance: number) {
        let result = false;
        if (vec1.length !== vec2.length) {
            return result;
        } else {
            result = true;
            for (let i = 0; i < vec1.length; i++) {
                if (!this.approxEq(vec1[i], vec2[i], tolerance)) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    approxEq(num1: number, num2: number, tolerance: number): boolean {
        const res = Math.abs(num1 - num2) < tolerance;
        return res;
    }

    removeConsecutivePointDuplicates(points: Inputs.Base.Point3[], checkFirstAndLast = true, tolerance = 1e-7): Inputs.Base.Point3[] {
        const pointsRemaining = [];
        if (points.length > 1) {
            for (let i = 1; i < points.length; i++) {
                const currentPoint = points[i];
                const previousPoint = points[i - 1];
                if (!this.arePointsTheSame(currentPoint, previousPoint, tolerance)) {
                    pointsRemaining.push(previousPoint);
                }
                if (i === points.length - 1) {
                    pointsRemaining.push(currentPoint);
                }
            }
            if (checkFirstAndLast) {
                const firstPoint = pointsRemaining[0];
                const lastPoint = pointsRemaining[pointsRemaining.length - 1];
                if (this.arePointsTheSame(firstPoint, lastPoint, tolerance)) {
                    pointsRemaining.pop();
                }
            }
        } else if (points.length === 1) {
            pointsRemaining.push(...points);
        }
        return pointsRemaining;
    }

    arePointsTheSame(pointA: Inputs.Base.Point3 | Inputs.Base.Point2, pointB: Inputs.Base.Point3 | Inputs.Base.Point2, tolerance: number): boolean {
        let result = false;
        if (pointA.length === 2 && pointB.length === 2) {
            if (this.approxEq(pointA[0], pointB[0], tolerance) &&
                this.approxEq(pointA[1], pointB[1], tolerance)) {
                result = true;
            }
        } else if (pointA.length === 3 && pointB.length === 3) {
            if (this.approxEq(pointA[0], pointB[0], tolerance) &&
                this.approxEq(pointA[1], pointB[1], tolerance) &&
                this.approxEq(pointA[2], pointB[2], tolerance)) {
                result = true;
            }
        }
        return result;
    }

    localAxes(size: number, scene: BABYLON.Scene, colorXHex: string, colorYHex: string, colorZHex: string): BABYLON.Mesh {
        const pilotLocalAxisX = BABYLON.MeshBuilder.CreateLines("pilot_local_axisX" + Math.random(), {
            points: [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
                new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ]
        }, scene);
        const colorX = BABYLON.Color3.FromHexString(colorXHex);
        pilotLocalAxisX.color = colorX;

        const pilotLocalAxisY = BABYLON.MeshBuilder.CreateLines("pilot_local_axisY" + Math.random(), {
            points: [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
            ]
        }, scene);
        const colorY = BABYLON.Color3.FromHexString(colorYHex);
        pilotLocalAxisY.color = colorY;

        const pilotLocalAxisZ = BABYLON.MeshBuilder.CreateLines("pilot_local_axisZ" + Math.random(), {
            points: [
                BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
            ]
        }, scene);
        const colorZ = BABYLON.Color3.FromHexString(colorZHex);
        pilotLocalAxisZ.color = colorZ;

        const localOrigin = new BABYLON.Mesh("local_origin" + Math.random(), scene);
        localOrigin.isVisible = false;

        pilotLocalAxisX.parent = localOrigin;
        pilotLocalAxisY.parent = localOrigin;
        pilotLocalAxisZ.parent = localOrigin;

        return localOrigin;
    }

    drawPoint(inputs: Inputs.Point.DrawPointDto): BABYLON.Mesh {
        const vectorPoints = [inputs.point];

        let colorsHex: string[] = [];
        if (Array.isArray(inputs.colours)) {
            colorsHex = inputs.colours;
        } else {
            colorsHex = [inputs.colours];
        }
        // const { positions, colors } = this.setUpPositionsAndColours(vectorPoints, colours);
        if (inputs.pointMesh && inputs.updatable) {
            this.updatePointsInstances(inputs.pointMesh, vectorPoints);
        } else {
            inputs.pointMesh = this.createPointSpheresMesh(
                `poinsMesh${Math.random()}`, vectorPoints, colorsHex, inputs.opacity, inputs.size, inputs.updatable
            );
        }
        return inputs.pointMesh;
    }

    drawPoints(inputs: Inputs.Point.DrawPointsDto): BABYLON.Mesh {
        const vectorPoints = inputs.points;
        let coloursHex: string[] = [];
        if (Array.isArray(inputs.colours)) {
            coloursHex = inputs.colours;
            if (coloursHex.length === 1) {
                coloursHex = inputs.points.map(() => coloursHex[0]);
            }
        } else {
            coloursHex = inputs.points.map(() => inputs.colours as string);
        }
        if (inputs.pointsMesh && inputs.updatable) {
            if (inputs.pointsMesh.getChildMeshes().length === vectorPoints.length) {
                this.updatePointsInstances(inputs.pointsMesh, vectorPoints);
            } else {
                inputs.pointsMesh.dispose();
                inputs.pointsMesh = this.createPointSpheresMesh(
                    `pointsMesh${Math.random()}`, vectorPoints, coloursHex, inputs.opacity, inputs.size, inputs.updatable
                );
            }
        } else {
            inputs.pointsMesh = this.createPointSpheresMesh(
                `pointsMesh${Math.random()}`, vectorPoints, coloursHex, inputs.opacity, inputs.size, inputs.updatable
            );
        }
        return inputs.pointsMesh;
    }


    updatePointsInstances(mesh: BABYLON.Mesh, positions: any[]): void {

        const children = mesh.getChildMeshes();
        const po = {};
        positions.forEach((pos, index) => {
            po[index] = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
        });

        children.forEach((child: BABYLON.InstancedMesh) => {
            child.position = po[child.metadata.index];
        });
    }

    private setUpPositionsAndColours(vectorPoints: number[][], colours: BABYLON.Color3[]): { positions, colors } {
        const positions = [];
        const colors = [];

        if (colours.length === vectorPoints.length) {
            vectorPoints.forEach((p, index) => {
                positions.push(...p);
                colors.push(colours[index].r, colours[index].g, colours[index].b, 1);
            });
        } else {
            vectorPoints.forEach((p, index) => {
                positions.push(...p);
                colors.push(colours[0].r, colours[0].g, colours[0].b, 1);
            });
        }

        return { positions, colors };
    }

    private createPointSpheresMesh(
        meshName: string, positions: Inputs.Base.Point3[], colors: string[], opacity: number, size: number, updatable: boolean): BABYLON.Mesh {

        const positionsModel = positions.map((pos, index) => {
            return {
                position: pos,
                color: colors[index],
                index
            };
        });

        const colorSet = Array.from(new Set(colors));
        const materialSet = colorSet.map((colour, index) => {

            const mat = new BABYLON.StandardMaterial(`mat${Math.random()}`, this.context.scene);

            mat.disableLighting = true;
            mat.emissiveColor = BABYLON.Color3.FromHexString(colour);
            mat.alpha = opacity;

            const positions = positionsModel.filter(s => s.color === colour);

            return { hex: colorSet, material: mat, positions };
        });

        const pointsMesh = new BABYLON.Mesh(meshName, this.context.scene);
        materialSet.forEach(ms => {
            const segments = ms.positions.length > 1000 ? 1 : 6;
            let pointMesh;
            if (ms.positions.length < 10000) {
                pointMesh = BABYLON.MeshBuilder.CreateSphere(`point${Math.random()}`, { diameter: size, segments, updatable }, this.context.scene);
            } else {
                pointMesh = BABYLON.MeshBuilder.CreateBox(`point${Math.random()}`, { size, updatable }, this.context.scene);
            }
            pointMesh.material = ms.material;
            pointMesh.isVisible = false;

            ms.positions.forEach((pos, index) => {
                const instance = pointMesh.createInstance(`point-${index}-${Math.random()}`);
                instance.position = new BABYLON.Vector3(pos.position[0], pos.position[1], pos.position[2]);
                instance.metadata = { index: pos.index };
                instance.parent = pointsMesh;
                instance.isVisible = true;
            });
        });

        return pointsMesh;
    }

}
