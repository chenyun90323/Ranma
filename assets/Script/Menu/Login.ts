import Game from '../Game/Game';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lg extends cc.Component {


   



    togo  () {
    
            cc.director.loadScene("Game", function (error: Error, asset: cc.SceneAsset) {                
                cc.log("Next scene loaded ...");
                let urlEnemys: string = 'enemy';
                let urlTowers: string = 'tower';
                let urlStrategy: string = 'strategy';
                Game._instance.init(urlEnemys, urlTowers, urlStrategy);
                cc.log("Next scene loaded over");
            });
        
           
        }
       
    }

