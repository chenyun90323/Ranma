enum State {
        Start = 0,
        Pause = 1,
        Stop = 2,
        Continue = Start,
};

export default class Timer {

    private _state: State = State.Stop; 
    private _start: Date = null;
    private _pause: Date = null;
    private _multiple: number = 0;

    start (multiple: number = 1) {
        let self = this;
        if (self._state == State.Stop) {
            self._start = new Date();
            self._multiple = multiple;
            self._state = State.Start;
        } else {
            throw new Error("\"开始\"错误,当前为:" + self.state());
        }
    }

    pause () {
        let self = this;
        if (self._state == State.Start) {
            self._pause = new Date();
            self._state = State.Pause;
        } else {
            throw new Error("\"暂停\"错误,当前为:" + self.state());
        }
    }

    continue () {
        let self = this;
        if (self._state == State.Pause) {
            let pause: number = new Date().getTime() - self._pause.getTime();
            let start: number = self._start.getTime() + pause;
            self._start.setTime(start);
            self._state = State.Continue;
        } else {
            throw new Error("\"继续\"错误,当前为:" + self.state());
        }
    }

    stop () {
        let self = this;
        if (self._state == State.Start || self._state == State.Pause) {
            self._pause = null;
            self._start = null;
            self._multiple = 0;
            self._state = State.Stop;
        } else {
            throw new Error("\"停止\"错误,当前为:" + self.state());
        }
    }

    state (): string {
        let self = this;
        switch (self._state) {
            case State.Continue:
            case State.Start: return 'start';
            case State.Pause: return 'pause';
            case State.Stop: return 'stop';
            default: throw new Error("\"状态\"错误,当前为:" + self._state);
        }
    }

    changeMultiple (multiple: number) {
        let self = this;
        let now: Date;
        switch (self._state) {
            case State.Start:
            case State.Continue:
                now = new Date();
                break;
            case State.Pause:
                now = self._pause;
                break;
            case State.Stop:
            default: throw new Error("\"改变倍数\"错误,当前为:" + self.state());
        }
        let start: Date = new Date(self._start);
        let pre: number = (now.getTime() - start.getTime()) * self._multiple;
        let after: number = now.getTime() - pre / multiple;
        self._start.setTime(after);
        self._multiple = multiple;
    }

    getTime (): number {
        let self = this;
        //cc.log(self._state, self._start, self._pause);
        switch (self._state) {
            case State.Continue:
            case State.Start: return (new Date().getTime() - self._start.getTime()) * self._multiple / 1000;
            case State.Pause: return (self._pause.getTime() - self._start.getTime()) * self._multiple / 1000;
            case State.Stop: return 0;
            default: throw new Error("\"询问\"错误,当前为:" + self.state());
        }
    }
}
