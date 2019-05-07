import Timer from './misc/Timer';
import EnemyInstance from './enemy/EnemyInstance';
const {ccclass, property} = cc._decorator;

export class StrategyAttribute {
    attribute: number;
    times: number;
    interval: number;
    after: number;
};

enum State {
    Start,
    Monster,
    Interval,
    After,
    Over
};

@ccclass
export default class Strategy extends cc.Component {

    @property({type: cc.Label})
    label: cc.Label = null;

    timer: Timer = null;
    multiple: number = 1;

    isGame: boolean = false;
    //当前执行 items[index], times 次
    index: number = 0;
    items: StrategyAttribute[] = null;
    times: number = 0;
    stTimer: number = 0;
    t0Timer: number = 0;
    t1Timer: number = 0;

    static _instance: Strategy;

    private _state: State = State.Over;
    changeState (state: State) {
        let self = this;
        //cc.log("\"改变状态\",当前:" + self.stateStr() + ",改变后:" + self.stateStr(state));
        switch (self._state) {
            case State.Start:
                if (state == State.Monster || state == State.After) {
                    self._state = state;
                    return;
                }
                break;
            case State.Monster:
                if (state == State.Interval) {
                    self._state = state;
                    return;
                }
                break;
            case State.Interval:
                if (state == State.Monster || state == State.After) {
                    self._state = state;
                    return;
                }
                break;
            case State.After:
                if (state == State.Monster || state == State.Over) {
                    self._state = state;
                    return;
                }
                break;
            case State.Over:
                if (state == State.Start) {
                    self._state = state;
                    return;
                }
                break;
            default:
                break;
        }
        throw Error("\"改变状态\"错误,当前:" + self.stateStr() + ",改变后:" + self.stateStr(state));
    }
    stateStr (state: State = this._state): string {
        switch (state) {
            case State.Start: return 'Start';
            case State.Monster: return 'Monster';
            case State.Interval: return 'Interval';
            case State.After: return 'After';
            case State.Over: return 'Over';
            default: return String(state);
        }
    }
    state (): State {
        return this._state;
    }

    init (items: StrategyAttribute[]) {
        let self = this;
        self.items = items;
    }

    update (dt) {
        let self = this;
        self.label.string = (self.timer.getTime()).toFixed(0);

        let loop: boolean = true;
        while (loop) {
            switch (self.state()) {
                case State.Start:
                    if(self.items[self.index].attribute == -1) {
                        self.changeState(State.After);
                    } else {
                        self.changeState(State.Monster);
                    }
                    break;
                case State.Monster:
                    EnemyInstance._instance.createEnemy(self.items[self.index].attribute);
                    self.changeState(State.Interval);
                    break;
                case State.Interval:
                    if (self.stTimer < self.items[self.index].interval) {
                        self.t1Timer = self.timer.getTime();
                        self.stTimer += self.t1Timer - self.t0Timer;
                        //cc.log("t0", self.t0Timer, "t1", self.t1Timer, "st", self.stTimer)
                        self.t0Timer = self.t1Timer;
                        loop = false;
                    } else {
                        if (self.times < self.items[self.index].times) {
                            self.times++;
                            self.stTimer = 0;
                            self.changeState(State.Monster);
                        } else {
                            self.times = 0;
                            self.stTimer = 0;
                            self.changeState(State.After);
                        }
                    }
                    break;
                case State.After:
                    if (self.stTimer < self.items[self.index].after) {
                        self.t1Timer = self.timer.getTime();
                        self.stTimer += self.t1Timer - self.t0Timer;
                        self.t0Timer = self.t1Timer;
                        loop = false;
                    } else {
                        if (self.index < self.items.length - 1) {
                            self.index++;
                            self.stTimer = 0;
                            self.changeState(State.Monster);
                        } else {
                            self.t0Timer = 0;
                            self.t1Timer = 0;
                            self.stTimer = 0;
                            self.isGame = false;
                            self.timer.stop();
                            self.index = 0;
                            self.changeState(State.Over);
                        }
                    }
                    break;
                case State.Over:
                    if (self.isGame) {
                        self.changeState(State.Start);
                    } else {
                        loop = false;
                    }
                    break;
                default:
                    throw Error("自动状态机错误:" + self.stateStr());
            }
        }

    }

    onLoad () {
        let self = this;
        Strategy._instance = self; 
        self.timer = new Timer();
    }

    onClick (event: cc.EventTarget, customEventData: string) {
        let self = this;
        switch (customEventData) {
            case 'start':
                self.timer.start(self.multiple);
                self.isGame = true;
                break;
            case 'pause':
                self.timer.pause();
                cc.director.pause();
                break;
            case 'continue':
                self.timer.continue();
                cc.director.resume();
                break;
            case 'stop':
                self.timer.stop();
                //self.isGame = false;
                break;
            case '1':
                self.multiple = 1;
                if (self.timer.state() != 'stop') {
                    self.timer.changeMultiple(self.multiple);
                }
                break;
            case '2':
                self.multiple = 2;
                if (self.timer.state() != 'stop') {
                    self.timer.changeMultiple(self.multiple);
                }
                break;
            case '3':
                self.multiple = 3;
                if (self.timer.state() != 'stop') {
                    self.timer.changeMultiple(self.multiple);
                }
                break;
            case '10':
                self.multiple = 10;
                if (self.timer.state() != 'stop') {
                    self.timer.changeMultiple(self.multiple);
                }
                break;
            default: throw new Error("\"onClick\"错误:" + self.timer.state());
        }
    }
}
