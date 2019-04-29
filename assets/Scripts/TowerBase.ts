import BulletInstance from './BulletInstance';
import TowerInstance from './TowerInstance';
import EnemyInstance from './EnemyInstance';
import { TowerAttribute } from './TowerInstance';

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class TowerBase extends cc.Component {
    
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

    @property({tooltip: "攻击伤血"})
    damages: number[] = [];

    @property({tooltip: "速度"})
    speeds: number[] = [];
    
    parent: TowerInstance = null;

    bulletInstance: BulletInstance;
    enemys: cc.Node[] = null;
    private _timer: number = 0;
    setTimer (timer: number) {
        this._timer = timer;
    }
    getTimer (): number {
        return this._timer;
    }

    init(parent: TowerInstance, item: TowerAttribute) {
        cc.log('TowerBase', "init");
        let self = this;

        self.towerName = item.towerName;
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
        
        self.node.getChildByName('upper part').angle = 0;
        self.textureMapping(self.towerName, self.urlUpperParts[self.level], self.urlPedestals[self.level]);
    }

    update (dt: number) {
        let self = this;
        self._timer -= dt;        
        self.aim(self.enemys, self.node.getPosition(cc.v2()), self._timer);
    }

    // lateUpdate () {}

    /*start () {
        cc.log('TowerBase', "start");
        let self = this;
    }*/

    onLoad () {
        cc.log('TowerBase', "onLoad");
        let self = this;

        /*let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;*/
        self.bulletInstance = BulletInstance._instance;
        self.enemys = EnemyInstance._instance.enemys;
        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    onDestroy () {
        cc.log('TowerBase', "onDestroy");
        let self = this;
        self.node.off(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.off(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.off(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    touchStart (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('TowerBase', 'touchStart', self);
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
        cc.log('TowerBase', 'touchEnd', self);
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.clear();
    }

    touchCancel (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('TowerBase', 'touchCancel', self);
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

    abstract aim (enemys: cc.Node[], position: cc.Vec2, timer: number);
    abstract attack (origin: cc.Vec2, angle: number, target: cc.Vec2);
}