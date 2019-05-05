

const {ccclass, property} = cc._decorator;

@ccclass
export default class mianUI extends cc.Component {

   
        togo (event: cc.EventTarget, customEventData: string) {
            let self = this;
            cc.log(event, customEventData);
            switch (customEventData) {
                default:
                case '0':
                cc.director.loadScene("Tower")
                    break;
                case '1':
                cc.director.loadScene("Tower")
                    break;
                case '2':
                cc.director.loadScene("Tower")
                    break;
            }
            
        }
    }
    
   


