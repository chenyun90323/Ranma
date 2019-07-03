import Ammunition from "./Ammunition";
import { AmmoAttribute } from './AmmoInstance';
import AmmoInstance from './AmmoInstance';
import Strategy from '../Strategy';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hitting extends Ammunition {

    _target: cc.Node = null;
    _damage: boolean = false;

    init (ammoAttribute: AmmoAttribute, origin: cc.Vec2, target: cc.Node, parent: AmmoInstance) {
        let self = this;
        super.init(ammoAttribute, origin, target, parent);
        self._target = target;
    }

    update(dt: number) {
        let self = this;

        if (!self.hit) {
            let AB: cc.Vec2 = self.node.getPosition(cc.v2()).add(self._target.getPosition(cc.v2()).mul(dt * self.speed * Strategy._instance.multiple));
            cc.log(AB);
            self.node.setPosition(AB);
        }
    }

    flying () {
        let self = this;
        self.node.getChildByName('sprite').active = true;
        self.node.getChildByName('particle').active = false;
        self.node.getComponent(cc.BoxCollider).enabled = true;

        self.node.getChildByName('particle').getComponent(cc.ParticleSystem).stopSystem();

        self.hit = false;
    }

    hitting () {
        let self = this;
        self.node.getChildByName('sprite').active = false;
        self.node.getChildByName('particle').active = true;
        self.node.getComponent(cc.BoxCollider).enabled = false;

        self.node.getChildByName('particle').getComponent(cc.ParticleSystem).resetSystem();

        self.hit = true;
    }

    isDamage(_: cc.Node): boolean {
        let self = this;
        if (self._damage) {
            return self._damage;
        } else {
            self._damage = true;
            return false;
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     */
    onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider) {
        let self = selfChildren.node.getComponent(Hitting);
        let other = otherChildren.node;
        //cc.log(otherChildren.tag, 'bullet', self, 'other', other);
        switch (otherChildren.tag) {
            default:
            case 0: { // default
                break;
            }
            case 1: { // 撞怪
                let particleEffect: cc.ActionInstant = cc.callFunc(function(_target, hitting: Hitting) {
                    hitting.hitting();
                }, this, self);//粒子效果

                class Args {
                    constructor (hitting: Hitting, node: cc.Node) {
                        this.hitting = hitting;
                        this.node = node;
                    }
                    hitting: Hitting;
                    node: cc.Node;
                }
                let finished: cc.ActionInstant = cc.callFunc(function(_target, args: Args) {
                    args.hitting.flying();
                    args.hitting.parent.onAmmoKilled(args.node);
                }, this, new Args(self, selfChildren.node));//动作完成后会将节点放进对象池

                let myAction = cc.sequence(particleEffect, cc.delayTime(0.2), finished);
                self.node.runAction(myAction);
                break;
            }
            case 2: { // 撞墙
                self.parent.onAmmoKilled(selfChildren.node);
                break;
            }
        }
    }
}
