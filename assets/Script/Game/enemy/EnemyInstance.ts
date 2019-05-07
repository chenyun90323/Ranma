import Enemy from './Enemy';
import Defence from '../Defence';
import Route from '../misc/Route';
const {ccclass, property} = cc._decorator;

export class EnemyAttribute { 
    HP: number;
    URL: string;
    speed: number;
};

@ccclass
export default class EnemyInstance extends cc.Component {

    @property({type: cc.Prefab, tooltip: "敌人Prefab"})
    enemyPrefab: cc.Prefab = null;

    items: EnemyAttribute[] = null;
    route: cc.Vec2[];

    enemyPool: cc.NodePool = new cc.NodePool("Enemy");
    enemys: cc.Node[] = new Array<cc.Node>();

    static _instance: EnemyInstance;

    lateUpdate () {
        let self = this;
        //cc.log("EnemyInstance", "lateUpdate")
        self.enemys.sort((a: cc.Node, b: cc.Node) => {
            let A: number = a.getComponent(Enemy).getDistance();
            let B: number = b.getComponent(Enemy).getDistance();
            return A - B;
        });
    }

    onLoad () {
        cc.log('EnemyInstance', "onLoad");
        let self = this;

        EnemyInstance._instance = self;

        let initCount: number = 15;
        for (let i: number = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(self.enemyPrefab); // 创建节点
            self.enemyPool.put(enemy); // 通过 put 接口放入对象池
        }

        self.route = new Route(30, 20, cc.v2(480, 320)).route;
    }

    init (items: EnemyAttribute[]) {
        let self = this;
        self.items = items;
    }

    createEnemy (index: number) {
        let self = this;
        let enemy: cc.Node = null;
        if (self.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = self.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(self.enemyPrefab);
        }

        let item: EnemyAttribute = self.items[index];
        enemy.getComponent(Enemy).init(self, item.HP, item.URL, item.speed, self.route); //接下来就可以调用 enemy 身上的脚本进行初始化
        enemy.parent = EnemyInstance._instance.node; // 将生成的敌人加入节点树
        self.enemys.push(enemy);
    }

    onEnemyPassed (enemy: cc.Node) {
        let self = this;
        // enemy 应该是一个 cc.Node
        self.enemys.shift();
        cc.log('Enemy passed', enemy.getComponent(Enemy).HP);
        self.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    onEnemyKilled (enemy: cc.Node, index: number) {
        let self = this;
        // enemy 应该是一个 cc.Node
        self.enemys.splice(index, 1);
        cc.log('Enemy killed', enemy.getComponent(Enemy).HP);
        self.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}