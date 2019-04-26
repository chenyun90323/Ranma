const {ccclass, property} = cc._decorator;

@ccclass
export default class Wall extends cc.Component {
    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }
}