import EnemyInstance, { EnemyAttribute } from './enemy/EnemyInstance';
import TowerInstance, { TowerAttribute } from './tower/TowerInstance';
import AmmoInstance from './ammo/AmmoInstance';
import Enemy from './enemy/Enemy';
import { Ammo } from './misc/Units';
import Strategy, { StrategyAttribute } from './Strategy';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property({tooltip: "敌人配置"})
    urlEnemys: string = '';

    @property({tooltip: "塔配置"})
    urlTowers: string = '';

    @property({tooltip: "策略配置"})
    urlStrategy: string = '';

    @property({type: cc.Prefab, tooltip: "墙Prefab"})
    wallPrefab: cc.Prefab = null;

    enemyItems: EnemyAttribute[] = null;
    towerItems: TowerAttribute[] = null;
    strategyItems: StrategyAttribute[] = null;

    enemyInstance: EnemyInstance;
    towerInstance: TowerInstance;
    ammoInstance: AmmoInstance;
    strategy: Strategy;

    static _instance: Game;

    init (urlEnemys: string, urlTowers: string, urlStrategy: string) {
        cc.log('Game', "init");
        let self = this;
        self.urlEnemys = urlEnemys;
        self.urlStrategy = urlStrategy;
        self.urlTowers = urlTowers;

        cc.loader.loadRes('config/' + self.urlEnemys,
            function (error, json: cc.JsonAsset) {
                if (error) {
                    cc.log(error.message || error);
                    return;
                }
                self.enemyItems = self.parseEnemy(json);
                self.enemyInstance.init(self.enemyItems);
                cc.log(self.enemyInstance);
            });

        cc.loader.loadRes('config/' + self.urlTowers,
            function (error, json: cc.JsonAsset) {
                if (error) {
                    cc.log(error.message || error);
                    return;
                }
                self.towerItems = self.parseTower(json);
                self.towerInstance.init(self.towerItems);
                cc.log(self.towerInstance);
            });

        cc.loader.loadRes('config/' + self.urlStrategy,
            function (error, json: cc.JsonAsset) {
                if (error) {
                    cc.log(error.message || error);
                    return;
                }
                self.strategyItems = self.parseStrategy(json);
                self.strategy.init(self.strategyItems);
                cc.log(self.strategyItems);
            });
        cc.log('over')
    }

    onLoad () {
        cc.log('Game', "onLoad");
        let self = this;
        self.enemyInstance = EnemyInstance._instance;
        self.towerInstance = TowerInstance._instance;
        self.ammoInstance = AmmoInstance._instance;
        self.strategy = Strategy._instance;

        Game._instance = self;
    }

    onDestroy () {
        this.enemyInstance.enemyPool.clear();
    }

    //update (dt: number) {}

    lateUpdate () {
        let self = this;

        /*self.enemyInstance.enemys.forEach((_enemy) => {
            let enemy = _enemy.getComponent(Enemy);
            if (enemy.getWay() >= enemy.route.length - 1) {
                self.enemyInstance.onEnemyPassed(_enemy);
            } else {
                //cc.log("is alive");
            }
        });*/
    }
 
    parseEnemy (jsonAsset: cc.JsonAsset): EnemyAttribute[] {
        let items: EnemyAttribute[] = new Array<EnemyAttribute>();

        jsonAsset.json['Monster'].forEach(enemyAttributeJson => {
            let item: EnemyAttribute = new EnemyAttribute();
            item.HP = enemyAttributeJson['HP'];
            item.URL = enemyAttributeJson['URL'];
            item.speed = enemyAttributeJson['speed'];
            //cc.log('parseEnemy', item);
            items.push(item);
        });

        return items;
    }

    parseTower (jsonAsset: cc.JsonAsset): TowerAttribute[] {
        let items: TowerAttribute[] = new Array<TowerAttribute>();

        jsonAsset.json['Tower'].forEach(towerAttributeJson => {
            let item: TowerAttribute = new TowerAttribute();
            item.towerName = towerAttributeJson['towerName'];
            item.pattern = this.parseAmmo(towerAttributeJson['pattern']);
            item.level = towerAttributeJson['level'];
            item.urlUpperParts = towerAttributeJson['URLs']['upper part'];
            item.urlPedestals = towerAttributeJson['URLs']['pedestal'];
            item.urlBullets = towerAttributeJson['URLs']['bullet'];
            item.urlParticles = towerAttributeJson['URLs']['particle'];
            item.attackIntervals = towerAttributeJson['attackInterval'];
            item.damages = towerAttributeJson['damage'];
            item.maxRadiuses = towerAttributeJson['maxRadius'];
            item.minRadiuses = towerAttributeJson['minRadius'];
            item.speeds = towerAttributeJson['speed'];

            //cc.log('parseTower', item);
            items.push(item);
        });

        return items;
    }

    parseStrategy (jsonAsset: cc.JsonAsset): StrategyAttribute[] {
        let items: StrategyAttribute[] = new Array<StrategyAttribute>();
        cc.log(jsonAsset.json['Strategy']);
        jsonAsset.json['Strategy']['wave'].forEach(strategyAttributeJson => {
            let item: StrategyAttribute = new StrategyAttribute();
            item.attribute = strategyAttributeJson['attribute'];
            item.interval = strategyAttributeJson['interval'];
            item.times = strategyAttributeJson['times'];
            item.after = strategyAttributeJson['after'];

            cc.log('parseStrategy', item);
            items.push(item);
        });
        return items;
    }

    parseAmmo (patternString: string): Ammo {
        switch (patternString) {
            case "bullet":
            case "Bullet":
            case "BULLET":
                return Ammo.Bullet;
            case "bomb":
            case "Bomb":
            case "BOMB":
                return Ammo.Bomb;
            case "hitting":
            case "Hitting":
            case "HITTING":
                return Ammo.Hitting;
            default:
                throw new Error("Method not implemented.");
        }
    }

    onSwitch (event: cc.EventTarget, customEventData: string) {
        let self = this;

        switch (customEventData) {
            default:
            case '3':
                let characteristic: any[] = new Array();
                self.enemyInstance.enemys.forEach((_enemy) => {
                    let enemy = _enemy.getComponent(Enemy);
                    characteristic.push({'url': enemy.url, 'speed': enemy.speed, 'stamina': enemy.stamina, 'HP': enemy.HP, 'way': enemy.getWay()});
                });
                cc.log(self.enemyInstance.enemyPool, self.enemyInstance.enemys.length, characteristic);
                cc.log(self.towerInstance.towers.length);
                cc.log(self.ammoInstance);
                break;
            case '4':
                self.enemyInstance.createEnemy(0);
                //cc.log(self.enemyPool);
                break;
        }
    }
}