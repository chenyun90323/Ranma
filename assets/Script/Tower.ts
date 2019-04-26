import Units from "./Units";
import BulletInstance from './BulletInstance';
import TowerInstance from './TowerInstance';
import EnemyInstance from './EnemyInstance';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tower extends cc.Component {
    
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

    @property({tooltip: "塔贴图"})
    urlTowers: string[] = [];  

    @property({tooltip: "子弹贴图"})
    urlBullets: string[] = [];

    @property({tooltip: "攻击伤血"})
    damages: number[] = [];

    @property({tooltip: "速度"})
    speeds: number[] = [];
    
    parent: TowerInstance = null;

    bulletInstance: BulletInstance;
    enemys: cc.Node[] = null;
    timer: number = 0;

    init(parent: TowerInstance, towerName: string, level: number = 0, urlSprites: string[], urlBullets: string[], attackIntervals: number[], damages: number[], maxRadiuses: number[], minRadiuses: number[], speeds: number[]) {
        cc.log('Tower', "init");
        let self = this;

        self.towerName = towerName;
        self.level = level;
        self.maxRadiuses = maxRadiuses;
        self.minRadiuses = minRadiuses;
        self.attackIntervals = attackIntervals;
        self.damages = damages;
        self.speeds = speeds;
        self.parent = parent;
    
        self.urlTowers = urlSprites;
        self.urlBullets = urlBullets;
        
        self.node.angle = 0;
        let url: string = 'image/tower/' + self.towerName + '/sprites/' + self.urlTowers[self.level];
        cc.loader.loadRes(url, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }); 
    }

    update (dt: number) {
        let self = this;
        
        self.timer -= dt;
        let position: cc.Vec2 = self.node.getPosition();
        
        self.aim(self.enemys, position, self.timer);
    }

    // lateUpdate () {}

    /*start () {
        cc.log('Tower', "start");
        let self = this;
    }*/

    onLoad () {
        cc.log('Tower', "onLoad");
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
        cc.log('Tower', "onDestroy");
        let self = this;
        self.node.off(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.off(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.off(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    touchStart (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('touchStart', self);
        if (self.urlTowers.length - 1 > self.level) {
            self.level++;
            let url: string = 'image/tower/' + self.towerName + '/sprites/' + self.urlTowers[self.level];
            cc.loader.loadRes(url, cc.SpriteFrame, function (error, spriteFrame) {
                if (error) {
                    cc.log(error.message || error);
                    return;
                }
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
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
        cc.log('touchEnd', self);
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.clear();
    }

    touchCancel (event: cc.Event.EventTouch) {
        let self = this;
        cc.log('touchCancel', self);
        let graphics: cc.Graphics = self.node.getChildByName('range').getComponent(cc.Graphics);
        graphics.clear();
    }

    /*touchMove (event: cc.Event.EventTouch) {
        let self = this;
        //cc.log('touchMove', self);
    }*/

    aim (enemys: cc.Node[], position: cc.Vec2, timer: number) {
        let self = this;
        let hasChange: boolean = false;
        let target: cc.Vec2;
        let angle: number;

        enemys.reverse();
        enemys.forEach(emeny => {
            let A: cc.Vec2 = emeny.getPosition();
            let AB: cc.Vec2 = position.sub(A);
            let rAB: number = AB.mag();
            if (rAB <= self.maxRadiuses[self.level] && rAB >= self.minRadiuses[self.level]) {
                angle = Units.vectorsToDegress(AB);
                target = cc.v2(-AB.x, -AB.y);
                hasChange = true;
            }   
        });
        enemys.reverse();

        
        if (hasChange) {
            self.node.angle = angle;
            if (timer <= 0) {
                let origin: cc.Vec2 = self.node.getPosition();
                self.setTimer(self.attackIntervals[self.level]);
                self.attack(origin, angle, target);
            }
        }
    }

    setTimer(timer: number) {
        this.timer = timer;
    }

    attack (origin: cc.Vec2, angle: number, target: cc.Vec2) {
        let self = this;
        
        self.bulletInstance.createBullet(self.node.parent, self.towerName, self.urlBullets[self.level], origin, angle, target, self.damages[self.level], self.speeds[self.level]);
    }
}