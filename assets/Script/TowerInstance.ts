import Tower from './Tower';
const {ccclass, property} = cc._decorator;

export class TowerAttribute {
    towerName: string;
    level: number;
    maxRadiuses: number[];
    minRadiuses: number[];
    attackIntervals: number[];
    damages: number[];
    speeds: number[];
    urlSprites: string[];
    urlBullets: string[];
};

@ccclass
export default class TowerInstance extends cc.Component {
   
    @property({type: cc.Prefab, tooltip: "塔Prefab"})
    towerPrefab: cc.Prefab = null;

    items: TowerAttribute[] = null;

    towerPool: cc.NodePool = new cc.NodePool("Tower");
    towers: cc.Node[] = new Array<cc.Node>();

    static _instance: TowerInstance;

    onLoad () {
        cc.log('TowerInstance', "onLoad");
        let self = this;

        TowerInstance._instance = this;

        let initCount: number = 5;
        for (let i: number = 0; i < initCount; ++i) {
            let tower = cc.instantiate(self.towerPrefab); // 创建节点
            self.towerPool.put(tower); // 通过 put 接口放入对象池
        }
    }

    init (items: TowerAttribute[]) {
        this.items = items;
    }

    createTower (position: cc.Vec2, index: number = 0) {
        let self = this;

        let tower: cc.Node = null;
        if (self.towerPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            tower = self.towerPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            tower = cc.instantiate(self.towerPrefab);
        }
        tower.setPosition(position);
        tower.parent = TowerInstance._instance.node; // 将生成的敌人加入节点树
        self.towers.push(tower);

        let item: TowerAttribute = self.items[index];
        //let item: TowerAttribute = self.items[1];
        tower.getComponent(Tower).init(self, item.towerName, item.level, item.urlSprites, item.urlBullets, item.attackIntervals, item.damages, item.maxRadiuses, item.minRadiuses, item.speeds); //接下来就可以调用 tower 身上的脚本进行初始化
    }
}