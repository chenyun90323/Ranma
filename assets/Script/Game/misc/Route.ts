import Defence from '../Defence';
export default class Route {
    /*
     * position0: 右上
     * position1: 左下
     */
    constructor (width: number, height: number, position0: cc.Vec2, position1: cc.Vec2 = undefined) {
        let self = this;

        if (position1 == undefined) {
            position1 = position0.neg();
        }

        let has: boolean = true;
        let tiledLayer: cc.Vec2[] = new Array<cc.Vec2>();
        for (let index = 2; has; index++) {
            has = false;
            for (let x = 0; !has && x < width; x++) {
                for (let y = 0; !has && y < height; y++) {
                    let tile: number = Defence._instance.barrier.getTileGIDAt(x, height - 1 - y);
                    if (index == tile) {
                        tiledLayer.push(cc.v2(x, y));
                        has = true;
                        break;
                    }
                }
            }
        }
        let X: number = (position0.x - position1.x) / width;
        let Y: number = (position0.y - position1.y) / height;
        let pos: cc.Vec2 = cc.v2((position0.x - position1.x) / 2, (position0.y - position1.y) / 2);
        tiledLayer.forEach(xy => {
            self.route.push(cc.v2(xy.x * X + X / 2 - pos.x, xy.y * Y + Y / 2 - pos.y));
        });
        //cc.log(X, Y, pos, self.route);
    }
    route: cc.Vec2[] = new Array<cc.Vec2>();
}
