import AmmoI from './AmmoI';
import { Ammo } from '../misc/Units';
import AmmoInstance, { AmmoAttribute } from './AmmoInstance';

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class Ammunition extends cc.Component implements AmmoI {

    @property({type: cc.Enum(Ammo), tooltip: "发射方式"})
    pattern: Ammo = Ammo.Bullet;

    @property()
    speed: number = 0;

    @property()
    damage: number = 0;

    @property({tooltip: "名字"})
    towerName: string = '';

    @property({tooltip: "子弹贴图"})
    urlBullet: string = '';

    @property({tooltip: "粒子贴图"})
    urlParticle: string = '';

    parent: AmmoInstance = null;
    angle: number = null;

    hit: boolean = false;

    init(ammoAttribute: AmmoAttribute, origin: cc.Vec2, target: cc.Node, parent: AmmoInstance) {
        let self = this;

        self.parent = parent;
        self.node.angle = self.angle;

        self.pattern = ammoAttribute.pattern;
        self.towerName = ammoAttribute.towerName;
        self.urlBullet = ammoAttribute.urlBullet;
        self.urlParticle = ammoAttribute.urlParticle;
        self.damage = ammoAttribute.damage;
        self.speed = ammoAttribute.speed;

        let _urlAmmo: string = 'image/tower/' + self.towerName + '/bullets/' + self.urlBullet;
        cc.loader.loadRes(_urlAmmo, cc.SpriteFrame, function (error, spriteFrame) {
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

    onLoad () {
        cc.log('Ammo', "onLoad");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
    }

    abstract isDamage (emenyNode: cc.Node): boolean;
    abstract update (dt: number);
    abstract onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider);
}
