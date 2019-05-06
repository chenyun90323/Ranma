import Units, { PointAndLine } from "./misc/Units";
import EnemyInstance from "./EnemyInstance";
import Ammunition from './Ammunition';
import Strategy from './Strategy';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    @property({tooltip: "速度"})
    speed: number = 0;

    @property({tooltip: "血量"})
    stamina: number = 0;

    @property({tooltip: "HP"})
    HP: number = 0;

    @property({tooltip: "敌人贴图"})
    url: string = '';  

    @property({type: [cc.Vec2], tooltip: "路径"})
    route: cc.Vec2[] = new Array<cc.Vec2>();

    parent: EnemyInstance = null;

    private _distance: number = 0;
    distance (way: number, route: cc.Vec2[]) {
        let self = this;
        self._distance = 0;
        for (let i = way; i < route.length - 1; i++) {
            self._distance += route[i + 1].sub(route[i]).mag();
        }
        self._distance -= route[way].sub(self.node.getPosition()).mag();
        //cc.log(self._distance);
    }
    getDistance (): number {
        return this._distance;
    }

    private _way: number = 0;
    getWay (): number {
        return this._way;
    }
    setWay (way: number) {
        this._way = way;
    }

    update (dt: number) {
        let self = this;
        //cc.log(self.url, "update");
        let way: number = self.getWay();
        self.path(dt, way, self.route, self.node.getPosition(), self.speed);
        self.distance(way, self.route);
    }


    /*lateUpdate () {
        let self = this;
        cc.log(self.url, "lateUpdate");
    }*/

    //unuse () {}

    //reuse () {}

    onLoad () {
        cc.log('Enemy', "onLoad");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    }

    init(parent: EnemyInstance, stamina: number, url: string = '', speed: number = 100) {
        let self = this;

        self.parent = parent;
        self.speed = speed;
        self.stamina = stamina;
        self.HP = stamina;
        self.url = url;
   
        self.setWay(0);
        self.node.setPosition(self.route[0]);
        cc.loader.loadRes('image/enemy/' + self.url, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }

    path (dt: number, way: number, route: cc.Vec2[], position: cc.Vec2, speed: number) {
        let self = this;

        if (self.hasWay()) {
            let P0: cc.Vec2 = route[way + 1].sub(position);
            let P1: cc.Vec2 = position.add(P0.normalize().mul(dt * speed * Strategy._instance.multiple));
            let dir: PointAndLine = Units.dir(route[way], P1, route[way + 1]);
            if (dir == PointAndLine.Line) {
                self.node.setPosition(P1);
            } else {
                self.setWay(way + 1);
                self.node.setPosition(route[self.getWay()]);

            }
        } else {
            self.parent.onEnemyPassed(self.node);
        }
    }

    hasWay (): boolean {
        let self = this;

        if (self.route == null || self.route == undefined || self.route.length - 1 <= self.getWay()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     */
    onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider) {
        let self = selfChildren.node.getComponent(Enemy);
        let other = otherChildren.node.getComponent(Ammunition);
        //console.log('emeny', self, 'other', other);

        let enemys: cc.Node[] = self.parent.enemys;
        let index: number = -1;

        enemys.some((emenyNode: cc.Node, _index) => {
            //cc.log(emenyNode.getComponent(Enemy") === self);
            if (emenyNode.getComponent(Enemy) === self) {
                if (!other.isDamage(self.node)) {
                    let damage = other.damage;
                    self.HP -= damage;
                    index = _index;
                    if (self.HP <= 0) {
                        self.parent.onEnemyKilled(self.node, index);
                    }
                }
                return true;
            } else {
                return false;
            }
        });
    }
}