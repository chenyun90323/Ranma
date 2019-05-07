import Ammunition from './Ammunition';
import Bullet from './Bullet';
import { Ammo } from '../misc/Units';
const {ccclass, property} = cc._decorator;

export class AmmoAttribute {
    constructor (pattern: Ammo, speed: number, damage: number, towerName: string, urlBullet: string, urlParticle: string) {
        let self = this;
        self.pattern = pattern;
        self.speed = speed;
        self.damage = damage;
        self.towerName = towerName;
        self.urlBullet = urlBullet;
        self.urlParticle = urlParticle;
    }
    pattern: Ammo;
    speed: number;
    damage: number;
    towerName: string;
    urlBullet: string;
    urlParticle: string;
};

@ccclass
export default class AmmoInstance extends cc.Component {

    @property({type: cc.Prefab, tooltip: "子弹Prefab"})
    ammoPrefab: cc.Prefab = null;

    ammoPool: cc.NodePool = new cc.NodePool("Bullet");

    static _instance: AmmoInstance;

    onLoad () {
        cc.log('AmmoInstance', "onLoad");
        let self = this;

        AmmoInstance._instance = self;

        let initCount: number = 15;
        for (let i: number = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(self.ammoPrefab); // 创建节点
            self.ammoPool.put(bullet); // 通过 put 接口放入对象池
        }
    }

    createAmmo (parentNode: cc.Node, ammoAttribute: AmmoAttribute, origin: cc.Vec2, target: cc.Node) {
        let self = this;

        let ammo: cc.Node = null;
        if (self.ammoPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            ammo = self.ammoPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            ammo = cc.instantiate(self.ammoPrefab);
        }
        switch (ammoAttribute.pattern) {
            case Ammo.Bullet:
                ammo.addComponent(Bullet);
                break;
            case Ammo.Bomb:
            case Ammo.Hitting:
            default:
                throw new Error("Method not implemented.");
        }
        ammo.parent = parentNode; // 将生成的敌人加入节点树
        ammo.getComponent(Ammunition).init(ammoAttribute, origin, target, self); //接下来就可以调用 enemy 身上的脚本进行初始化
    }

    onAmmoKilled (ammo: cc.Node) {
        // ammo 应该是一个 cc.Node
        let self = this;
        switch (ammo.getComponent(Ammunition).pattern) {
            case Ammo.Bullet:
                ammo.removeComponent(Bullet)
                break;
            case Ammo.Bomb:
            case Ammo.Hitting:
            default:
                throw new Error("Method not implemented.");
        }
        //cc.log(ammo);
        self.ammoPool.put(ammo); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}