import Menu from './Menu';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Defence extends cc.Component {

    @property({type: cc.TiledLayer, tooltip: "barrier图层"})
    barrier: cc.TiledLayer = null;

    onLoad () {
        cc.log('Defence', "onLoad");
        let self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }

    onDisable () {
        cc.log('Defence', "onDestroy");
        let self = this;
        
        self.node.off(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        //self.node.off(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.off(cc.Node.EventType.TOUCH_END, self.touchEnd, self);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self.touchCancel, self);
    }
    
    touchStart (event: cc.Event.EventTouch) {
        //cc.log('Defence touchStart', event);
        let self = this;
        let xy: cc.Vec2 = self.node.convertToNodeSpaceAR(event.getLocation());
        let position: cc.Vec2 = event.getLocation();
        position.x = Math.floor(position.x / 32);
        position.y = Math.floor(position.y / 32);

        Menu._instance.closeMenu();
        let tile: number = self.barrier.getTileGIDAt(position.x, 19 - position.y);
        cc.log(tile);
        if (tile === 1) {
            Menu._instance.openMenu(xy);
        } else {
            cc.log('空');
        }        
    }

    /*touchMove (event: cc.Event.EventTouch) {
        cc.log('Defence touchMove', event);
    }*/

    touchEnd (event: cc.Event.EventTouch) {
        //cc.log('Defence touchEnd', event);
    }

    touchCancel (event: cc.Event.EventTouch) {
        cc.log('Defence touchCancel', event);
    }

}