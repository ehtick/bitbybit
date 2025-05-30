import { GeometryHelper } from "./geometry-helper";
import { MathBitByBit } from "./math";
import { Point } from "./point";
import { Transforms } from "./transforms";
import { Vector } from "./vector";
import * as Inputs from "../inputs";
import { UnitTestHelper } from "../unit-test-helper";
import { Lists } from "./lists";

describe("Point unit tests", () => {
    const uh = new UnitTestHelper();

    let geometryHelper: GeometryHelper;
    let math: MathBitByBit;
    let vector: Vector;
    let point: Point;
    let lists: Lists;
    let transforms: Transforms;

    beforeAll(() => {
        geometryHelper = new GeometryHelper();
        math = new MathBitByBit();
        vector = new Vector(math, geometryHelper);
        transforms = new Transforms(vector, math);
        lists = new Lists();
        point = new Point(geometryHelper, transforms, vector, lists);
    });

    describe("Point Class Unit Tests (Integration)", () => {

        describe("transformPoint", () => {
            it("should translate a point correctly", () => {
                const p: Inputs.Base.Point3 = [1, 2, 3];
                const translationVec: Inputs.Base.Vector3 = [10, -5, 2];
                const transformation = transforms.translationXYZ({ translation: translationVec });
                const result = point.transformPoint({ point: p, transformation });
                uh.expectPointCloseTo(result, [11, -3, 5]);
            });

            it("should rotate a point around Z axis", () => {
                const p: Inputs.Base.Point3 = [1, 0, 5];
                const transformation = transforms.rotationCenterAxis({
                    center: [0, 0, 0],
                    axis: [0, 0, 1],
                    angle: 90
                });
                const result = point.transformPoint({ point: p, transformation });
                uh.expectPointCloseTo(result, [0, 1, 5]);
            });

            it("should scale a point relative to origin", () => {
                const p: Inputs.Base.Point3 = [2, 3, 4];
                const transformation = transforms.scaleCenterXYZ({
                    center: [0, 0, 0],
                    scaleXyz: [2, 0.5, 1]
                });
                const result = point.transformPoint({ point: p, transformation });
                uh.expectPointCloseTo(result, [4, 1.5, 4]);
            });
        });

        describe("transformPoints", () => {
            it("should translate multiple points correctly", () => {
                const pts: Inputs.Base.Point3[] = [[1, 2, 3], [10, 10, 10]];
                const translationVec: Inputs.Base.Vector3 = [5, -5, 0];
                const transformation = transforms.translationXYZ({ translation: translationVec });
                const result = point.transformPoints({ points: pts, transformation });
                uh.expectPointsCloseTo(result, [[6, -3, 3], [15, 5, 10]]);
            });

            it("should rotate multiple points", () => {
                const pts: Inputs.Base.Point3[] = [[1, 0, 0], [0, 1, 5]];
                const transformation = transforms.rotationCenterAxis({
                    center: [0, 0, 0],
                    axis: [0, 0, 1],
                    angle: -90
                });
                const result = point.transformPoints({ points: pts, transformation });
                uh.expectPointsCloseTo(result, [[0, -1, 0], [1, 0, 5]]);
            });

            it("should handle empty points array", () => {
                const pts: Inputs.Base.Point3[] = [];
                const transformation = transforms.identity();
                const result = point.transformPoints({ points: pts, transformation: [transformation] });
                expect(result).toEqual([]);
            });
        });

        describe("transformsForPoints", () => {
            it("should apply individual transforms to corresponding points", () => {
                const pts: Inputs.Base.Point3[] = [[1, 0, 0], [5, 5, 5]];
                const transformations = [
                    transforms.rotationCenterAxis({ center: [0, 0, 0], axis: [0, 0, 1], angle: 90 }),
                    transforms.translationXYZ({ translation: [1, 1, 1] })
                ];
                const result = point.transformsForPoints({ points: pts, transformation: transformations });
                uh.expectPointsCloseTo(result, [[0, 1, 0], [6, 6, 6]]);
            });

            it("should throw an error if points and transformations lengths differ", () => {
                const pts: Inputs.Base.Point3[] = [[1, 1, 1]];
                const transformations = [[transforms.identity()], [transforms.identity()]];
                expect(() => {
                    point.transformsForPoints({ points: pts, transformation: transformations });
                }).toThrow("You must provide equal nr of points and transformations");
            });

            it("should handle empty arrays", () => {
                const pts: Inputs.Base.Point3[] = [];
                const transformations: any[] = [];
                const result = point.transformsForPoints({ points: pts, transformation: transformations });
                expect(result).toEqual([]);
            });
        });

        describe("translatePoints", () => {
            it("should translate points by a single vector", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, -1, 2]];
                const translation: Inputs.Base.Vector3 = [10, 20, 30];
                const result = point.translatePoints({ points: pts, translation });
                uh.expectPointsCloseTo(result, [[10, 20, 30], [11, 19, 32]]);
            });
        });

        describe("translatePointsWithVectors", () => {
            it("should apply individual translation vectors to corresponding points", () => {
                const pts: Inputs.Base.Point3[] = [[1, 1, 1], [5, 5, 5]];
                const translations: Inputs.Base.Vector3[] = [[10, 0, 0], [0, 20, 0]];
                const result = point.translatePointsWithVectors({ points: pts, translations });
                uh.expectPointsCloseTo(result, [[11, 1, 1], [5, 25, 5]]);
            });

            it("should throw an error if points and translations lengths differ", () => {
                const pts: Inputs.Base.Point3[] = [[1, 1, 1]];
                const translations: Inputs.Base.Vector3[] = [[10, 0, 0], [0, 20, 0]];
                expect(() => {
                    point.translatePointsWithVectors({ points: pts, translations });
                }).toThrow("You must provide equal nr of points and translations");
            });
        });

        describe("translateXYZPoints", () => {
            it("should translate points by individual x, y, z values", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, -1, 2]];
                const x = -1, y = 2, z = -3;
                const result = point.translateXYZPoints({ points: pts, x, y, z });
                uh.expectPointsCloseTo(result, [[-1, 2, -3], [0, 1, -1]]);
            });
        });

        describe("scalePointsCenterXYZ", () => {
            it("should scale points relative to a center", () => {
                const pts: Inputs.Base.Point3[] = [[2, 2, 2], [0, 0, 0]];
                const center: Inputs.Base.Point3 = [1, 1, 1];
                const scaleXyz: Inputs.Base.Vector3 = [2, 3, 0.5];
                const result = point.scalePointsCenterXYZ({ points: pts, center, scaleXyz });
                uh.expectPointsCloseTo(result, [[3, 4, 1.5], [-1, -2, 0.5]]);
            });
        });

        describe("rotatePointsCenterAxis", () => {
            it("should rotate points around a center and axis", () => {
                const pts: Inputs.Base.Point3[] = [[2, 1, 5], [1, 1, 0]];
                const center: Inputs.Base.Point3 = [1, 1, 5];
                const axis: Inputs.Base.Vector3 = [0, 0, 1];
                const angle = 90;
                const result = point.rotatePointsCenterAxis({ points: pts, center, axis, angle });
                uh.expectPointsCloseTo(result, [[1, 2, 5], [1, 1, 0]]);
            });
        });

        describe("boundingBoxOfPoints", () => {
            it("should calculate the correct bounding box for multiple points", () => {
                const points: Inputs.Base.Point3[] = [[1, 2, 3], [4, -1, 6], [0, 5, -2]];
                const expectedBBox: Inputs.Base.BoundingBox = {
                    min: [0, -1, -2],
                    max: [4, 5, 6],
                    center: [2, 2, 2],
                    width: 4,
                    height: 6,
                    length: 8,
                };
                const result = point.boundingBoxOfPoints({ points });
                expect(result.min).toEqual(expectedBBox.min);
                expect(result.max).toEqual(expectedBBox.max);
                uh.expectPointCloseTo(result.center, expectedBBox.center);
                expect(result.width).toBeCloseTo(expectedBBox.width);
                expect(result.height).toBeCloseTo(expectedBBox.height);
                expect(result.length).toBeCloseTo(expectedBBox.length);
            });

            it("should return a zero-dimension bounding box for a single point", () => {
                const points: Inputs.Base.Point3[] = [[5, 5, 5]];
                const expectedBBox: Inputs.Base.BoundingBox = {
                    min: [5, 5, 5],
                    max: [5, 5, 5],
                    center: [5, 5, 5],
                    width: 0,
                    height: 0,
                    length: 0,
                };
                const result = point.boundingBoxOfPoints({ points });
                expect(result).toEqual(expectedBBox);
            });

            it("should handle empty points array", () => {
                const points: Inputs.Base.Point3[] = [];
                const result = point.boundingBoxOfPoints({ points });
                expect(result.min).toEqual([Infinity, Infinity, Infinity]);
                expect(result.max).toEqual([-Infinity, -Infinity, -Infinity]);
                expect(result.center).toEqual([NaN, NaN, NaN]);
                expect(result.width).toEqual(-Infinity); // max - min = -Inf - Inf = -Inf
                expect(result.height).toEqual(-Infinity);
                expect(result.length).toEqual(-Infinity);
            });
        });

        describe("closestPointFromPoints methods", () => {
            const sourcePoint: Inputs.Base.Point3 = [0, 0, 0];
            const targetPoints: Inputs.Base.Point3[] = [
                [10, 0, 0],
                [0, 5, 0],
                [0, 0, -7],
                [3, 4, 0],
            ];
            const expectedClosestPoint: Inputs.Base.Point3 = [0, 5, 0];
            const expectedClosestIndex = 2; // 1-based index
            const expectedClosestDistance = 5;

            it("closestPointFromPointsDistance should return the minimum distance", () => {
                const distance = point.closestPointFromPointsDistance({ point: sourcePoint, points: targetPoints });
                expect(distance).toBeCloseTo(expectedClosestDistance);
            });

            it("closestPointFromPointsIndex should return the 1-based index of the closest point", () => {
                const index = point.closestPointFromPointsIndex({ point: sourcePoint, points: targetPoints });
                expect(index).toBe(expectedClosestIndex);
            });

            it("closestPointFromPoints should return the coordinates of the closest point", () => {
                const closest = point.closestPointFromPoints({ point: sourcePoint, points: targetPoints });
                expect(closest).toEqual(expectedClosestPoint);
            });

            it("should handle empty target points list (check internal method behavior)", () => {
                const testFuncDistance = () => point.closestPointFromPointsDistance({ point: sourcePoint, points: [] });
                const testFuncIndex = () => point.closestPointFromPointsIndex({ point: sourcePoint, points: [] });
                const testFuncPoint = () => point.closestPointFromPoints({ point: sourcePoint, points: [] });
                expect(testFuncDistance()).toBe(Number.MAX_SAFE_INTEGER);
                expect(testFuncIndex()).toBeNaN();
                expect(testFuncPoint()).toBeUndefined();
            });
        });

        describe("distance", () => {
            it("should calculate the distance between two points", () => {
                const p1: Inputs.Base.Point3 = [1, 2, 3];
                const p2: Inputs.Base.Point3 = [4, -2, 15]; // dx=3, dy=-4, dz=12
                const dist = point.distance({ startPoint: p1, endPoint: p2 });
                expect(dist).toBeCloseTo(13);
            });

            it("should return 0 for coincident points", () => {
                const p1: Inputs.Base.Point3 = [5, 5, 5];
                const dist = point.distance({ startPoint: p1, endPoint: p1 });
                expect(dist).toBeCloseTo(0);
            });
        });

        describe("distancesToPoints", () => {
            it("should calculate distances from one start point to multiple end points", () => {
                const start: Inputs.Base.Point3 = [0, 0, 0];
                const ends: Inputs.Base.Point3[] = [
                    [3, 4, 0],  // dist 5
                    [0, 0, 1],  // dist 1
                    [1, 1, 1]   // dist sqrt(3) ~ 1.732
                ];
                const distances = point.distancesToPoints({ startPoint: start, endPoints: ends });
                expect(distances.length).toBe(3);
                expect(distances[0]).toBeCloseTo(5);
                expect(distances[1]).toBeCloseTo(1);
                expect(distances[2]).toBeCloseTo(Math.sqrt(3));
            });

            it("should return an empty array if end points list is empty", () => {
                const start: Inputs.Base.Point3 = [0, 0, 0];
                const ends: Inputs.Base.Point3[] = [];
                const distances = point.distancesToPoints({ startPoint: start, endPoints: ends });
                expect(distances).toEqual([]);
            });
        });

        describe("multiplyPoint", () => {
            it("should create an array with the specified number of identical points", () => {
                const p: Inputs.Base.Point3 = [10, 20, 30];
                const amount = 3;
                const result = point.multiplyPoint({ point: p, amountOfPoints: amount });
                expect(result).toHaveLength(amount);
                expect(result).toEqual([
                    [10, 20, 30],
                    [10, 20, 30],
                    [10, 20, 30]
                ]);
            });

            it("should return an empty array if amount is 0", () => {
                const p: Inputs.Base.Point3 = [10, 20, 30];
                const result = point.multiplyPoint({ point: p, amountOfPoints: 0 });
                expect(result).toEqual([]);
            });

            it("should return an empty array if amount is negative (or handle as error)", () => {
                const p: Inputs.Base.Point3 = [10, 20, 30];
                const result = point.multiplyPoint({ point: p, amountOfPoints: -1 });
                expect(result).toEqual([]);
            });
        });

        describe("getX, getY, getZ", () => {
            const p: Inputs.Base.Point3 = [-1.5, 0, 99.9];
            it("getX should return the first element", () => {
                expect(point.getX({ point: p })).toBe(-1.5);
            });
            it("getY should return the second element", () => {
                expect(point.getY({ point: p })).toBe(0);
            });
            it("getZ should return the third element", () => {
                expect(point.getZ({ point: p })).toBe(99.9);
            });
        });

        describe("averagePoint", () => {
            it("should calculate the average of multiple points", () => {
                const pts: Inputs.Base.Point3[] = [[1, 1, 1], [3, 5, -1], [5, 0, 6]];
                const result = point.averagePoint({ points: pts });
                uh.expectPointCloseTo(result, [3, 2, 2]);
            });

            it("should return the point itself if only one point is provided", () => {
                const pts: Inputs.Base.Point3[] = [[10, 20, 30]];
                const result = point.averagePoint({ points: pts });
                uh.expectPointCloseTo(result, [10, 20, 30]);
            });

            it("should return NaN components if points array is empty", () => {
                const pts: Inputs.Base.Point3[] = [];
                const result = point.averagePoint({ points: pts });
                expect(result[0]).toBeNaN();
                expect(result[1]).toBeNaN();
                expect(result[2]).toBeNaN();
            });
        });

        describe("pointXYZ", () => {
            it("should create a 3D point array from x, y, z", () => {
                const result = point.pointXYZ({ x: 1.1, y: -2.2, z: 3.3 });
                expect(result).toEqual([1.1, -2.2, 3.3]);
            });
        });

        describe("pointXY", () => {
            it("should create a 2D point array from x, y", () => {
                const result = point.pointXY({ x: 5, y: 10 });
                expect(result).toEqual([5, 10]);
            });
        });

        describe("spiral", () => {
            it("should generate the specified number of points", () => {
                const result = point.spiral({
                    phi: 1.618,
                    widening: 9,
                    radius: 10,
                    factor: 1,
                    numberPoints: 20
                });
                expect(result.length).toBe(20);
            });

            it("should generate points with Z=0", () => {
                const result = point.spiral({ phi: 1.618, widening: 9, radius: 5, factor: 2, numberPoints: 5 });
                expect(result.length).toBeGreaterThan(0);
                result.forEach(p => {
                    expect(p[0]).not.toBeNaN();
                    expect(p[1]).not.toBeNaN();
                    expect(p[2]).toBe(0);
                });
            });

            it("should handle step leading to division by zero in log (i=0)", () => {
                const result = point.spiral({ phi: 1.618, widening: 9, radius: 1, factor: 1, numberPoints: 2 });
                expect(result.length).toBe(2);
                expect(result[0]).toEqual([0, 0, 0]);
                expect(result[1][0]).not.toBeNaN();
                expect(result[1][1]).not.toBeNaN();
            });
        });

        describe("hexGrid", () => {
            it("should generate the correct number of points", () => {
                const nrX = 3, nrY = 4;
                const result = point.hexGrid({ radiusHexagon: 1, nrHexagonsX: nrX, nrHexagonsY: nrY, orientOnCenter: false, pointsOnGround: false });
                expect(result.length).toBe(nrX * nrY);
            });

            it("should generate points on XY plane by default", () => {
                const result = point.hexGrid({ radiusHexagon: 1, nrHexagonsX: 2, nrHexagonsY: 2, orientOnCenter: false, pointsOnGround: false });
                expect(result.length).toBe(4);
                result.forEach(p => expect(p[2]).toBe(0));
            });

            it("should place points on XZ plane if pointsOnGround is true", () => {
                const result = point.hexGrid({ radiusHexagon: 1, nrHexagonsX: 2, nrHexagonsY: 2, pointsOnGround: true, orientOnCenter: false });
                expect(result.length).toBe(4);
                result.forEach(p => expect(p[1]).toBe(0));
                expect(result[0][2]).toBe(0);
                if (result.length > 1) {
                    expect(result[1][2]).not.toBe(0);
                }
            });

            it("should center the grid if orientOnCenter is true", () => {
                const radius = 2;
                const nrX = 3, nrY = 3;
                const resultNoCenter = point.hexGrid({ radiusHexagon: radius, nrHexagonsX: nrX, nrHexagonsY: nrY, orientOnCenter: false, pointsOnGround: false });
                const resultCenter = point.hexGrid({ radiusHexagon: radius, nrHexagonsX: nrX, nrHexagonsY: nrY, orientOnCenter: true, pointsOnGround: false });

                let avgX = 0, avgY = 0, avgZ = 0;
                resultCenter.forEach(p => { avgX += p[0]; avgY += p[1]; avgZ += p[2]; });
                avgX /= resultCenter.length;
                avgY /= resultCenter.length;
                avgZ /= resultCenter.length;

                expect(avgX).toBeCloseTo(0.577);
                expect(avgY).toBeCloseTo(0);
                expect(avgZ).toBeCloseTo(0);

                expect(resultCenter).not.toEqual(resultNoCenter);
            });
        });

        describe("removeConsecutiveDuplicates", () => {
            it("should remove consecutive duplicate points within tolerance", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [0, 0, 1e-9], [1, 1, 1], [1, 1, 1 + 1e-4], [2, 2, 2]];
                const tolerance = 1e-5;
                const result = point.removeConsecutiveDuplicates({ points: pts, tolerance, checkFirstAndLast: false });
                uh.expectPointsCloseTo(result, [[0, 0, 0], [1, 1, 1], [1, 1, 1 + 1e-4], [2, 2, 2]]);
            });

            it("should remove consecutive duplicate points with default tolerance", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [0, 0, 1e-8], [1, 1, 1], [1, 1, 1 + 1e-3], [2, 2, 2]];
                const result = point.removeConsecutiveDuplicates({ points: pts, tolerance: undefined, checkFirstAndLast: false });
                uh.expectPointsCloseTo(result, [[0, 0, 0], [1, 1, 1], [1, 1, 1 + 1e-3], [2, 2, 2]]);
            });

            it("should keep all points if no consecutive duplicates exist", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];
                const result = point.removeConsecutiveDuplicates({ points: pts, tolerance: 1e-5, checkFirstAndLast: false });
                uh.expectPointsCloseTo(result, pts);
            });

            it("should handle checkFirstAndLast correctly for open polyline", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 0, 1e-9]];
                const result = point.removeConsecutiveDuplicates({ points: pts, checkFirstAndLast: true, tolerance: 1e-5 });
                uh.expectPointsCloseTo(result, [[0, 0, 0], [1, 1, 1], [2, 2, 2]]);
            });

            it("should handle checkFirstAndLast correctly for closed polyline (already duplicated)", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 0, 0]];
                const result = point.removeConsecutiveDuplicates({ points: pts, checkFirstAndLast: true, tolerance: 1e-5 });
                uh.expectPointsCloseTo(result, [[0, 0, 0], [1, 1, 1], [2, 2, 2]]);
            });

            it("should handle checkFirstAndLast=false", () => {
                const pts: Inputs.Base.Point3[] = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 0, 1e-9]]; // Last point close to first
                const result = point.removeConsecutiveDuplicates({ points: pts, checkFirstAndLast: false, tolerance: 1e-5 });
                uh.expectPointsCloseTo(result, [[0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 0, 1e-9]]);
            });

            it("should handle single point array", () => {
                const pts: Inputs.Base.Point3[] = [[1, 2, 3]];
                const result = point.removeConsecutiveDuplicates({ points: pts, tolerance: 1e-5, checkFirstAndLast: false });
                uh.expectPointsCloseTo(result, pts);
            });

            it("should handle empty point array", () => {
                const pts: Inputs.Base.Point3[] = [];
                const result = point.removeConsecutiveDuplicates({ points: pts, tolerance: 1e-5, checkFirstAndLast: false });
                expect(result).toEqual([]);
            });
        });

        describe("normalFromThreePoints", () => {
            it("should calculate the normal vector for non-collinear points (XY plane)", () => {
                const p1: Inputs.Base.Point3 = [0, 0, 0];
                const p2: Inputs.Base.Point3 = [1, 0, 0];
                const p3: Inputs.Base.Point3 = [0, 1, 0];
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false });
                uh.expectPointCloseTo(normal, [0, 0, 1]);
            });

            it("should calculate the normal vector for non-collinear points (off-axis)", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const p2: Inputs.Base.Point3 = [2, 1, 1];
                const p3: Inputs.Base.Point3 = [1, 2, 1];
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false });
                uh.expectPointCloseTo(normal, [0, 0, 1]);
            });

            it("should calculate the normal vector for points forming XZ plane", () => {
                const p1: Inputs.Base.Point3 = [0, 0, 0];
                const p2: Inputs.Base.Point3 = [1, 0, 0];
                const p3: Inputs.Base.Point3 = [0, 0, 1];
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false });
                uh.expectPointCloseTo(normal, [0, -1, 0]);
            });

            it("should reverse the normal if reverseNormal is true", () => {
                const p1: Inputs.Base.Point3 = [0, 0, 0];
                const p2: Inputs.Base.Point3 = [1, 0, 0];
                const p3: Inputs.Base.Point3 = [0, 1, 0];
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: true });
                uh.expectPointCloseTo(normal, [0, 0, -1]);
            });

            it("should return undefined for collinear points", () => {
                const p1: Inputs.Base.Point3 = [0, 0, 0];
                const p2: Inputs.Base.Point3 = [1, 1, 1];
                const p3: Inputs.Base.Point3 = [2, 2, 2];
                const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false });
                expect(normal).toBeUndefined();
                expect(consoleWarnSpy).toHaveBeenCalledWith("Points are collinear or coincident; cannot calculate a unique normal.");
                consoleWarnSpy.mockRestore();
            });

            it("should return undefined for coincident points", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const p2: Inputs.Base.Point3 = [1, 1, 1];
                const p3: Inputs.Base.Point3 = [2, 3, 4];
                const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
                const normal = point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false });
                expect(normal).toBeUndefined();
                expect(consoleWarnSpy).toHaveBeenCalledWith("Points are collinear or coincident; cannot calculate a unique normal.");
                consoleWarnSpy.mockRestore();
            });

            it("should throw error for invalid point formats", () => {
                const p1: any = [0, 0];
                const p2: Inputs.Base.Point3 = [1, 1, 1];
                const p3: Inputs.Base.Point3 = [2, 2, 2];
                expect(() => point.normalFromThreePoints({ point1: p1, point2: p2, point3: p3, reverseNormal: false })).toThrow("All points must be arrays of 3 numbers [x, y, z]");
                expect(() => point.normalFromThreePoints({ point1: null as any, point2: p2, point3: p3, reverseNormal: false })).toThrow("All points must be arrays of 3 numbers [x, y, z]");
            });
        });

        describe("twoPointsAlmostEqual", () => {
            it("should return true for points within tolerance", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const p2: Inputs.Base.Point3 = [1, 1, 1 + 1e-7];
                const tolerance = 1e-5;
                expect(point.twoPointsAlmostEqual({ point1: p1, point2: p2, tolerance })).toBe(true);
            });

            it("should return true for identical points", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const tolerance = 1e-5;
                expect(point.twoPointsAlmostEqual({ point1: p1, point2: p1, tolerance })).toBe(true);
            });

            it("should return false for points outside tolerance", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const p2: Inputs.Base.Point3 = [1, 1, 1 + 1e-4];
                const tolerance = 1e-5;
                expect(point.twoPointsAlmostEqual({ point1: p1, point2: p2, tolerance })).toBe(false);
            });

            it("should return false for points equal to tolerance distance", () => {
                const p1: Inputs.Base.Point3 = [1, 1, 1];
                const p2: Inputs.Base.Point3 = [1, 1, 1 + 1e-5];
                const tolerance = 1e-5;
                expect(point.twoPointsAlmostEqual({ point1: p1, point2: p2, tolerance })).toBe(false);
            });
        });

    });

    describe("PointService.sortPoints", () => {

        it("should return an empty array when given an empty array", () => {
            const input: Inputs.Point.PointsDto = { points: [] };
            const result = point.sortPoints(input);
            expect(result).toEqual([]);
        });

        it("should return the same array when given an array with a single point", () => {
            const pt: Inputs.Base.Point3 = [1, 2, 3];
            const input: Inputs.Point.PointsDto = { points: [pt] };
            const result = point.sortPoints(input);
            expect(result).toEqual([pt]);
        });

        it("should not modify the original input array (immutability)", () => {
            const originalPoints: Inputs.Base.Point3[] = [[3, 0, 0], [1, 0, 0], [2, 0, 0]];
            const input: Inputs.Point.PointsDto = { points: originalPoints };
            const originalCopy = [...originalPoints];
            const result = point.sortPoints(input);
            expect(result).not.toBe(originalPoints);
            expect(originalPoints).toEqual(originalCopy);
        });

        it("should correctly sort points primarily by the X coordinate", () => {
            const input: Inputs.Point.PointsDto = { points: [[3, 0, 0], [1, 5, 5], [2, -1, -1]] };
            const expected: Inputs.Base.Point3[] = [[1, 5, 5], [2, -1, -1], [3, 0, 0]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should correctly sort points with the same X coordinate by the Y coordinate", () => {
            const input: Inputs.Point.PointsDto = { points: [[1, 5, 0], [2, 0, 0], [1, 2, 5], [1, 8, -1]] };
            const expected: Inputs.Base.Point3[] = [[1, 2, 5], [1, 5, 0], [1, 8, -1], [2, 0, 0]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should correctly sort points with the same X and Y coordinates by the Z coordinate", () => {
            const input: Inputs.Point.PointsDto = { points: [[1, 5, 10], [2, 0, 0], [1, 5, -2], [1, 5, 0]] };
            const expected: Inputs.Base.Point3[] = [[1, 5, -2], [1, 5, 0], [1, 5, 10], [2, 0, 0]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should handle a mix of points with various coordinates including negatives", () => {
            const input: Inputs.Point.PointsDto = {
                points: [
                    [2, 1, 5], [1, 5, 0], [2, 1, 0], [-1, 10, 0], [1, 0, 0], [2, 0, 0], [-1, -5, 10]
                ]
            };
            const expected: Inputs.Base.Point3[] = [
                [-1, -5, 10], [-1, 10, 0], [1, 0, 0], [1, 5, 0], [2, 0, 0], [2, 1, 0], [2, 1, 5]
            ];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should handle already sorted points correctly", () => {
            const expected: Inputs.Base.Point3[] = [[1, 2, 3], [1, 2, 4], [1, 3, 0], [2, 0, 0]];
            const input: Inputs.Point.PointsDto = { points: [...expected] };
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should handle reverse sorted points correctly", () => {
            const input: Inputs.Point.PointsDto = { points: [[3, 0, 0], [2, 0, 0], [1, 0, 0]] };
            const expected: Inputs.Base.Point3[] = [[1, 0, 0], [2, 0, 0], [3, 0, 0]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should handle duplicate points", () => {
            const input: Inputs.Point.PointsDto = { points: [[1, 1, 1], [0, 0, 0], [2, 2, 2], [0, 0, 0], [1, 1, 1]] };
            const expected: Inputs.Base.Point3[] = [[0, 0, 0], [0, 0, 0], [1, 1, 1], [1, 1, 1], [2, 2, 2]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });

        it("should handle floating point numbers correctly", () => {
            const input: Inputs.Point.PointsDto = { points: [[1.5, 0.1, 0], [1.1, 0.2, 0], [1.5, 0, 0], [1.1, 0.1, 0]] };
            const expected: Inputs.Base.Point3[] = [[1.1, 0.1, 0], [1.1, 0.2, 0], [1.5, 0, 0], [1.5, 0.1, 0]];
            const result = point.sortPoints(input);
            expect(result).toEqual(expected);
        });
    });

    describe("calculateMaxFilletRadius", () => {
        const defaultTolerance = 1e-7; // Default tolerance for the function if not provided
        const precision = 6;           // Decimal places for toBeCloseTo assertions

        // Helper to create input object matching the confusing naming convention
        const createInput = (p1: Inputs.Base.Point3, corner: Inputs.Base.Point3, p2: Inputs.Base.Point3, tolerance: number = defaultTolerance): Inputs.Point.ThreePointsToleranceDto => ({
            start: p1,
            center: p2,
            end: corner,
            tolerance: tolerance
        });

        it("should calculate correct radius for a simple 90-degree corner (2D)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 3, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(3.0, precision);
        });

        it("should calculate correct radius for a symmetric 90-degree corner (2D)", () => {
            const geoP1: Inputs.Base.Point3 = [4, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 4, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(4.0, precision);
        });

        it("should calculate correct radius for an acute angle (60 degrees, 2D)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [5 * Math.cos(Math.PI / 3), 5 * Math.sin(Math.PI / 3), 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = 5 * Math.tan(Math.PI / 6);
            expect(point.maxFilletRadius(input)).toBeCloseTo(expected, precision);
        });

        it("should calculate correct radius for an obtuse angle (120 degrees, 2D)", () => {
            const geoP1: Inputs.Base.Point3 = [4, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [6 * Math.cos(2 * Math.PI / 3), 6 * Math.sin(2 * Math.PI / 3), 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = 4 * Math.tan(Math.PI / 3);
            expect(point.maxFilletRadius(input)).toBeCloseTo(expected, precision);
        });

        it("should return 0 for collinear points (0 degrees)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [10, 0, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);
        });

        it("should return 0 for collinear points (180 degrees)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [-3, 0, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);
        });

        it("should return 0 if one segment has near-zero length (P1=C)", () => {
            const geoP1: Inputs.Base.Point3 = [defaultTolerance / 2, 0, 0]; // Very close to C
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 3, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);
        });

        it("should return 0 if one segment has near-zero length (P2=C)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, defaultTolerance / 3, 0]; // Very close to C
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);
        });

        it("should use the provided tolerance if specified", () => {
            const customTolerance = 1e-4;
            const geoP1: Inputs.Base.Point3 = [customTolerance / 2, 0, 0]; // Near zero relative to custom tolerance
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 3, 0];
            const input = createInput(geoP1, geoC, geoP2, customTolerance);
            // Expect 0 because len1 < customTolerance
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);

            const geoP1_ok: Inputs.Base.Point3 = [customTolerance * 2, 0, 0]; // OK relative to custom tolerance
            const input_ok = createInput(geoP1_ok, geoC, geoP2, customTolerance);
            // Expect non-zero result here
            expect(point.maxFilletRadius(input_ok)).toBeGreaterThan(0);
        });

        it("should return 0 if all points coincide", () => {
            const geoP1: Inputs.Base.Point3 = [0, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 0, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadius(input)).toBeCloseTo(0, precision);
        });

        it("should calculate correct radius for a corner in 3D space", () => {
            const geoP1: Inputs.Base.Point3 = [1, 1, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 2, 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = Math.sqrt(2) * Math.tan(Math.PI / 8);
            expect(point.maxFilletRadius(input)).toBeCloseTo(expected, precision);
        });
    });

    describe("calculateMaxFilletRadiusHalfLine", () => {
        const defaultTolerance = 1e-7;
        const precision = 6;

        const createInput = (p1: Inputs.Base.Point3, corner: Inputs.Base.Point3, p2: Inputs.Base.Point3, tolerance: number = defaultTolerance): Inputs.Point.ThreePointsToleranceDto => ({
            start: p1, center: p2, end: corner, tolerance: tolerance
        });

        it("should calculate correct radius for a simple 90-degree corner (2D)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 3, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(1.5, precision);
        });

        it("should calculate correct radius for a symmetric 90-degree corner (2D)", () => {
            const geoP1: Inputs.Base.Point3 = [4, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 4, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(2.0, precision);
        });

        it("should calculate correct radius for an acute angle (60 degrees, 2D)", () => {
            const geoP1: Inputs.Base.Point3 = [6, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [4 * Math.cos(Math.PI / 3), 4 * Math.sin(Math.PI / 3), 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = 2 * Math.tan(Math.PI / 6);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(expected, precision);
        });

        it("should calculate correct radius for an obtuse angle (120 degrees, 2D)", () => {
            const geoP1: Inputs.Base.Point3 = [4, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [6 * Math.cos(2 * Math.PI / 3), 6 * Math.sin(2 * Math.PI / 3), 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = 2 * Math.tan(Math.PI / 3);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(expected, precision);
        });

        it("should return 0 for collinear points (0 degrees)", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [10, 0, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(0, precision);
        });

        it("should return 0 if one segment has near-zero length", () => {
            const geoP1: Inputs.Base.Point3 = [5, 0, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, defaultTolerance / 3, 0];
            const input = createInput(geoP1, geoC, geoP2);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(0, precision);
        });

        it("should calculate correct radius for a corner in 3D space", () => {
            const geoP1: Inputs.Base.Point3 = [1, 1, 0];
            const geoC: Inputs.Base.Point3 = [0, 0, 0];
            const geoP2: Inputs.Base.Point3 = [0, 2, 0];
            const input = createInput(geoP1, geoC, geoP2);
            const expected = (Math.sqrt(2) / 2.0) * Math.tan(Math.PI / 8);
            expect(point.maxFilletRadiusHalfLine(input)).toBeCloseTo(expected, precision);
        });
    });
});
