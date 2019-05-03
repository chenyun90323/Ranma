import Tower from './Tower';
import { Ammo } from './Units';
const {ccclass, property} = cc._decorator;

export class TowerAttribute {
    towerName: string;
    pattern: Ammo;
    level: number;
    maxRadiuses: number[];
    minRadiuses: number[];
    attackIntervals: number[];
    damages: number[];
    speeds: number[];
    urlUpperParts: string[];
    urlPedestals: string[];
    urlBullets: string[];
    urlParticles: string[];
};

@ccclass
export default class TowerInstance extends cc.Component {
   
    @property({type: cc.Prefab, tooltip: "塔Prefab"})
    towerPrefab: cc.Prefab = null;

    items: TowerAttribute[] = null;
    towers: cc.Node[] = new Array<cc.Node>();

    static _instance: TowerInstance;

    onLoad () {
        cc.log('TowerInstance', "onLoad");
        TowerInstance._instance = this;
    }

    init (items: TowerAttribute[]) {
        this.items = items;
    }

    createTower (position: cc.Vec2, index: number = 0) {
        let self = this;
        let item: TowerAttribute = self.items[index];
        let tower: cc.Node = null;
        tower = cc.instantiate(self.towerPrefab);
        tower.setPosition(position);
        tower.parent = TowerInstance._instance.node; // 将生成的敌人加入节点树
        self.towers.push(tower);
        tower.getComponent(Tower).init(self, item);
    }
}