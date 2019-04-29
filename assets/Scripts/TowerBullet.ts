import TowerBase from './TowerBase';
import Units from './Units';

const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerBullet extends TowerBase {
    
    aim (enemys: cc.Node[], position: cc.Vec2, timer: number) {
        let self = this;
        let hasChange: boolean = false;
        let target: cc.Vec2;
        let angle: number;

        enemys.reverse();
        enemys.forEach(emeny => {
            let B: cc.Vec2 = emeny.getPosition(cc.v2());
            let AB: cc.Vec2 = B.sub(position);
            let rAB: number = AB.mag();
            if (rAB <= self.maxRadiuses[self.level] && rAB >= self.minRadiuses[self.level]) {
                angle = Units.vectorsToDegress(AB);
                target = cc.v2(AB.x, AB.y);
                hasChange = true;
            }   
        });
        enemys.reverse();

        if (hasChange) {
            self.node.getChildByName('upper part').angle = angle;
            if (timer <= 0) {
                let origin: cc.Vec2 = self.node.getPosition();
                self.setTimer(self.attackIntervals[self.level]);
                self.attack(origin, angle, target);
            }
        }
    }

    attack (origin: cc.Vec2, angle: number, target: cc.Vec2) {
        let self = this;
        
        self.bulletInstance.createBullet(self.node.parent, self.towerName, self.urlBullets[self.level], origin, angle, target, self.damages[self.level], self.speeds[self.level]);
    }
}