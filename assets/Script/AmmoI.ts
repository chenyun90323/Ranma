export default interface AmmoI {
    update (dt: number);
    onCollisionStay (otherChildren: cc.BoxCollider, selfChildren: cc.BoxCollider);
}
