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
}