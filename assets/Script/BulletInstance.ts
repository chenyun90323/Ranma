import Bullet from './Bullet';
const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletInstance extends cc.Component {

    @property({type: cc.Prefab, tooltip: "子弹Prefab"})
    bulletPrefab: cc.Prefab = null;
    
    bulletPool: cc.NodePool = new cc.NodePool("Bullet");

    static _instance: BulletInstance;

    onLoad () {
        cc.log('BulletInstance', "onLoad");
        let self = this;

        BulletInstance._instance = this;

        let initCount: number = 15;
        for (let i: number = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(self.bulletPrefab); // 创建节点
            self.bulletPool.put(bullet); // 通过 put 接口放入对象池
        }
    }

    createBullet (parentNode: cc.Node, towerName: string, url: string, origin: cc.Vec2, angle: number, target: cc.Vec2, damage: number, speed: number) {
        let self = this;

        let bullet: cc.Node = null;
        if (self.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = self.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(self.bulletPrefab);
        }
        bullet.getComponent(Bullet).init(towerName, url, origin, angle, target, self, damage, speed); //接下来就可以调用 enemy 身上的脚本进行初始化
        bullet.parent = parentNode; // 将生成的敌人加入节点树
        //cc.log('bulletPool:', self.bulletPool.size(), 'bullet:', bullet.getComponent(Bullet'));
    }
    
    onBulletKilled (bullet: cc.Node) {
        // bullet 应该是一个 cc.Node
        //cc.log(bullet);
        this.bulletPool.put(bullet); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}