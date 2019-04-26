import TowerInstance from './TowerInstance';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    towerInstance: TowerInstance = null;

    static _instance: Menu;

    onLoad () {
        cc.log('Menu', "onLoad");
        let self = this;
        Menu._instance = this;
        self.towerInstance = TowerInstance._instance;
        self.node.setPosition(cc.v2(-1000, -1000));
        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }
    
    onDestroy () {
        cc.log('Menu', "onDestroy");
        let self = this;
        self.node.off(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        self.node.off(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.off(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    closeMenu () {
        let self = this;
        self.node.setPosition(cc.v2(-1000, -1000));
    }

    openMenu (position: cc.Vec2 = cc.v2()) {
        let self = this;
        self.node.setPosition(position);
    }

    onClick (event: cc.EventTarget, customEventData: string) {
        let self = this;
        cc.log(event, customEventData);
        switch (customEventData) {
            default:
            case '0':
                self.towerInstance.createTower(self.node.getPosition(), 0);
                break;
            case '1':
                self.towerInstance.createTower(self.node.getPosition(), 1);
                break;
        }
        self.closeMenu();
    }

    touchStart (event: cc.Event.EventTouch) {
        cc.log('Menu touchStart', event);
    }
    touchMove (event: cc.Event.EventTouch) {
        cc.log('Menu touchMove', event);
    }
    touchEnd (event: cc.Event.EventTouch) {
        cc.log('Menu touchEnd', event);
    }
    touchCancel (event: cc.Event.EventTouch) {
        cc.log('Menu touchCancel', event);
    }
}
