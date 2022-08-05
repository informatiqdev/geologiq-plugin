export class Point {
    x: number = 0; // easting
    y: number = 0; // tvd
    z: number = 0; // northing

    static isPoint(data: any): data is Point {
        if (data && typeof data.x === 'number' && typeof data.y === 'number' && typeof data.z === 'number') {
            return true;
        }

        return false;
    }

    /**
     * 
     * @param point if number array then [easting, tvd, northing]
     * @returns 
     */
    static getPoint(point?: Point | number[]): Point {
        if (Point.isPoint(point)) {
            return { ...point };
        }

        const current: Point = {
            x: point ? point[0] : 0,
            y: point ? point[1] : 0,
            z: point ? point[2] : 0
        };

        return current;
    };
}
