import TowerInstance from './TowerInstance';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Build extends cc.Component {
    towerInstance: TowerInstance;

    onLoad () {
        let self = this;
        self.towerInstance = TowerInstance._instance;
    }

    onClick (event: cc.EventTarget, customEventData: string) {
        let self = this;
        cc.log(customEventData, self.node);
        self.node.getComponent(cc.Button).destroy();
        self.node.getComponent(cc.Sprite).destroy();
        self.node.setScale(1, 1);
        self.towerInstance.createTower(self.node.getPosition());
    }
}
