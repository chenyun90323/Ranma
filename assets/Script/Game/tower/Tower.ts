import AmmoInstance, { AmmoAttribute } from '../ammo/AmmoInstance';
import TowerInstance from './TowerInstance';
import EnemyInstance from '../enemy/EnemyInstance';
import { TowerAttribute } from './TowerInstance';
import Units, { Ammo } from '../misc/Units';
import Strategy from '../Strategy';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tower extends cc.Component {

    @property({type: cc.Enum(Ammo), tooltip: "发射方式"})
    pattern: Ammo = Ammo.Bullet;

    @property({tooltip: "最大半径"})
    maxRadiuses: number[] = [];

    @property({tooltip: "最小半径"})
    minRadiuses: number[] = [];

    @property({tooltip: "攻击间隔"})
    attackIntervals: number[] = [];

    @property({tooltip: "名字"})
    towerName: string = '';

    @property({tooltip: "等级"})
    level: number = 0;

    @property({tooltip: "塔上部贴图"})
    urlUpperParts: string[] = []; 

    @property({tooltip: "塔基座贴图"})
    urlPedestals: string[] = [];

    @property({tooltip: "子弹贴图"})
    urlBullets: string[] = [];

    @property({tooltip: "粒子贴图"})
    urlParticles: string[] =[];

    @property({tooltip: "攻击伤血"})
    damages: number[] = [];

    @property({tooltip: "速度"})
    speeds: number[] = [];

    parent: TowerInstance = null;

    ammoInstance: AmmoInstance;
    enemys: cc.Node[] = null;
    private _timer: number = 0;
    setTimer (timer: number) {
        this._timer = timer;
    }
    getTimer (): number {
        return this._timer;
    }

    init(parent: TowerInstance, item: TowerAttribute) {
        cc.log('Tower', "init");
        let self = this;

        self.towerName = item.towerName;
        self.pattern = item.pattern;
        self.level = item.level;
        self.maxRadiuses = item.maxRadiuses;
        self.minRadiuses = item.minRadiuses;
        self.attackIntervals = item.attackIntervals;
        self.damages = item.damages;
        self.speeds = item.speeds;
        self.parent = parent;

        self.urlUpperParts = item.urlUpperParts;
        self.urlPedestals = item.urlPedestals;
        self.urlBullets = item.urlBullets;
        self.urlParticles = item.urlParticles;

        self.node.getChildByName('upper part').angle = 0;
        self.textureMapping(self.towerName, self.urlUpperParts[self.level], self.urlPedestals[self.level]);
    }

    update (dt: number) {
        let self = this;
        self._timer -= dt * Strategy._instance.multiple;
        self.aim(self.enemys, self.node.getPosition(cc.v2()), self._timer);
    }

    // lateUpdate () {}

    /*start () {
        cc.log('TowerBase', "start");
        let self = this;
    }*/

    onLoad () {
        cc.log('Tower', "onLoad");
        let self = this;

        /*let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;*/
        self.ammoInstance = AmmoInstance._instance;
        self.enemys = EnemyInstance._instance.enemys;
        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    onDestroy () {
        cc.log('Tower', "onDestroy");
        let self = this;
        self.node.off(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.off(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.off(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    touchStart (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('Tower', 'touchStart', self);
        if (self.urlUpperParts.length - 1 > self.level) {
            self.level++;
            self.textureMapping(self.towerName, self.urlUpperParts[self.level], self.urlPedestals[self.level]);
        } else {
            cc.log('以到最高级');
        }
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.circle(0, 0, self.maxRadiuses[self.level]);
        graphics.fill();
        //graphics.stroke();
    }

    touchEnd (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('Tower', 'touchEnd', self);
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.clear();
    }

    touchCancel (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('Tower', 'touchCancel', self);
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.clear();
    }

    textureMapping (towerName: string, upperPart: string, pedestal: string) {
        let self = this;
        let urlUpperPart: string = 'image/tower/' + towerName + '/sprites/' + upperPart;
        let urlPedestal: string = 'image/tower/' + towerName + '/sprites/' + pedestal;
        cc.loader.loadRes(urlUpperPart, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getChildByName('upper part').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }); 
        cc.loader.loadRes(urlPedestal, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getChildByName('pedestal').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }); 
    }

    /*touchMove (event: cc.Event.EventTouch) {
        let self = this;
        //cc.log('touchMove', self);
    }*/

    aim (enemys: cc.Node[], position: cc.Vec2, timer: number) {
        let self = this;

        enemys.some(emeny => {
            let B: cc.Vec2 = emeny.getPosition(cc.v2());
            let AB: cc.Vec2 = B.sub(position);
            let rAB: number = AB.mag();
            if (rAB <= self.maxRadiuses[self.level] && rAB >= self.minRadiuses[self.level]) {
                self.node.getChildByName('upper part').angle = Units.vectorsToDegress(AB);
                if (timer <= 0) {
                    let origin: cc.Vec2 = self.node.getPosition(cc.v2());
                    self.setTimer(self.attackIntervals[self.level]);
                    self.attack(origin, emeny);
                }
                return true;
            } else {
                return false;
            }   
        });
    }

    attack (origin: cc.Vec2, target: cc.Node) {
        let self = this;
        let ammoAttribute: AmmoAttribute = new AmmoAttribute(self.pattern, self.speeds[self.level],
                                                self.damages[self.level], self.towerName,
                                                self.urlBullets[self.level], self.urlParticles[self.level]);
        self.ammoInstance.createAmmo(self.node.parent, ammoAttribute, origin, target);
    }
}