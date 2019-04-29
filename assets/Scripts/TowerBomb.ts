import TowerBase from './TowerBase';
const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerBomb extends TowerBase {
    aim(enemys: cc.Node[], position: cc.Vec2, timer: number) {
        //throw new Error("Method not implemented.");
    }
    
    attack(origin: cc.Vec2, angle: number, target: cc.Vec2) {
        //throw new Error("Method not implemented.");
    }
}
