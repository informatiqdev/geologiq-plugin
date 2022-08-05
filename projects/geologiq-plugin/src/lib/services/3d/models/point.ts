export class Point {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    static isPoint(data: any): data is Point {
        if (data && typeof data.x === 'number' && typeof data.y === 'number' && typeof data.z === 'number') {
            return true;
        }

        return false;
    }

    static getPoint(current?: Point | number[]): Point {
        if (Point.isPoint(current)) {
            return current;
        }

        const point: Point = {
            x: current ? current[0] : 0,
            y: current ? current[1] : 0,
            z: current ? current[2] : 0
        };

        return point;
    };
}