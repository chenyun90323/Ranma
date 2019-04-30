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
        
        let _urlBullet: string = 'image/tower/' + self.towerName + '/bullets/' + self.urlBullet;
        cc.loader.loadRes(_urlBullet, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                cc.log(error.message || error);
                return;
            }
            self.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        
        let _urlParticle: string = 'image/tower/' + self.towerName + '/bullets/' + self.urlParticle;
        cc.loader.loadRes(_urlParticle, cc.ParticleAsset);

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

    onLoad () {
        cc.log('Bullet', "onLoad");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    }

    flying () {
        let self = this;
        self.node.getChildByName('sprite').active = true;
        self.node.getChildByName('particle').active = false;
        self.node.getComponent(cc.BoxCollider).enabled = true;

        self.node.getChildByName('particle').getComponent(cc.ParticleSystem).stopSystem();

        self.hit = false;
    }

    hitting () {
        let self = this;
        self.node.getChildByName('sprite').active = false;
        self.node.getChildByName('particle').active = true;
        self.node.getComponent(cc.BoxCollider).enabled = false;
        
        self.node.getChildByName('particle').getComponent(cc.ParticleSystem).resetSystem();

        self.hit = true;
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
                    bullet.hitting();
                }, this, self);//粒子效果

                class Args {
                    constructor (bullet: Bullet, node: cc.Node) {
                        this.bullet = bullet;
                        this.node = node;
                    }
                    bullet: Bullet;
                    node: cc.Node;
                }
                let finished: cc.ActionInstant = cc.callFunc(function(_target, args: Args) {
                    args.bullet.flying();
                    args.bullet.parent.onBulletKilled(args.node);
                }, this, new Args(self, selfChildren.node));//动作完成后会将节点放进对象池

                let myAction = cc.sequence(particleEffect, cc.delayTime(0.2), finished);
                self.node.runAction(myAction);
                break;
            }
            case 2: { // 撞墙
                self.parent.onBulletKilled(selfChildren.node);
                break;
            }
        }
    }
}