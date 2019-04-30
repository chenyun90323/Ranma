import BulletInstance from './BulletInstance';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property()
    speed: number = 1000;

    @property()
    damage: number = 100;

    @property({tooltip: "名字"})
    towerName: string = '';
    
    @property({tooltip: "子弹贴图"})
    urlBullet: string = '';

    @property({tooltip: "粒子贴图"})
    urlParticle: string = '';

    parent: BulletInstance = null;
    target: cc.Vec2 = null;
    angle: number = null;
    origin: cc.Vec2 = null;

    hit: boolean = false;
    //unuse () {}

    //reuse () {}

    init(towerName: string, urlBullet: string, urlParticle: string, origin: cc.Vec2, angle: number, target: cc.Vec2, parent: BulletInstance, damage: number = 200, speed: number = 1000) {
        let self = this;

        self.parent = parent;
        self.target = target.normalize();
        self.angle = angle;
        self.origin = origin;
        
        self.towerName = towerName;
        self.urlBullet = urlBullet;
        self.urlParticle = urlParticle;
        self.damage = damage;
        self.speed = speed;

        self.node.setPosition(self.origin);
        self.node.angle = self.angle;
        self.hit = false;
        let _url: string = 'image/tower/' + self.towerName + '/bullets/' + self.urlBullet;
        cc.loader.loadRes(_url, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        //cc.log(self);
    }

    update (dt: number) {
        let self = this;

        if (!self.hit) {
            let AB: cc.Vec2 = self.node.getPosition(cc.v2()).add(self.target.mul(dt * self.speed));
            //cc.log(AB);
            self.node.setPosition(AB);
        }
    }
    
    /*start () {
        cc.log('Bullet', "start");
        let self = this;
    }*/

    onLoad () {
        cc.log('Bullet', "onLoad");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     */
    onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider) {
        let self = selfChildren.node.getComponent(Bullet);
        let other = otherChildren.node;
        //cc.log(otherChildren.tag, 'bullet', self, 'other', other);
        switch (otherChildren.tag) {
            default:
            case 0: { // default
                break;
            }
            case 1: { // 撞怪
                let particleEffect: cc.ActionInstant = cc.callFunc(function(_target, bullet: Bullet) {
                    let _url: string = 'image/tower/' + bullet.towerName + '/bullets/' + bullet.urlParticle;
                    cc.loader.loadRes(_url, cc.ParticleAsset, function (error, particle) {
                        if (error) {
                            cc.log(error.message || error);
                            return;
                        }
                        bullet.addComponent(cc.ParticleSystem);
                        bullet.getComponent(cc.ParticleSystem);
                    });
                }, this, self);//粒子效果
                let finished: cc.ActionInstant = cc.callFunc(function(_target, node) {
                    this.parent.onBulletKilled(node);
                }, this, selfChildren.node);//动作完成后会将节点放进对象池

                var myAction = cc.sequence(particleEffect, cc.delayTime(1), finished);
                self.node.runAction(myAction);
                self.hit = true;
                break;
            }
            case 2: { // 撞墙
                self.parent.onBulletKilled(selfChildren.node);
                break;
            }
        }
    }
}