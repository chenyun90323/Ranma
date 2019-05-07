export default interface AmmoI {
    isDamage (emenyNode: cc.Node): boolean;
    update (dt: number);
    onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider);
}
