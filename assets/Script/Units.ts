const {ccclass, property} = cc._decorator;

export const enum PointAndLine {
    Anti_clockwise = 1,
    Clockwise = 2,
    Anti_extension_line = 3,
    Extension_line = 4,
    Line = 5
};

export default class Units {

    //计算向量AB与AP的外积(叉积)的大小(不包括方向)
    static cross (A: cc.Vec2, B: cc.Vec2, P: cc.Vec2): number {
        let AB: cc.Vec2 = B.sub(A);
        let AP: cc.Vec2 = P.sub(A);
        return AB.cross(AP);
    }

    //计算向量AB与向量AP的内积(点积)
    static dot (A: cc.Vec2, B: cc.Vec2, P: cc.Vec2): number {
        let AP: cc.Vec2 = P.sub(A);
        let PB: cc.Vec2 = B.sub(P);
	    return AP.dot(PB);
    }

    //求向量ab的模(也可以说是点a、b的距离)
    static mol (a: cc.Vec2, b: cc.Vec2): number {
	    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
    }
            
    //判断点P在线段AB的哪个方向上
    static dir (A: cc.Vec2, B: cc.Vec2, P: cc.Vec2): PointAndLine {
	    if (this.cross(A, B, P) > 0) return PointAndLine.Anti_clockwise;            //外积大于0,点p在线段AB的逆时针方向
	    else if (this.cross(A, B, P) < 0) return PointAndLine.Clockwise;            //外积小于0,点p在线段AB的顺时针方向
	    else if (this.dot(A, B, P) > 0) return PointAndLine.Anti_extension_line;    //内积小于0,点p在线段AB的反延长线上
	    else if (this.dot(A, B, P) <=0) {                                            //内积大于0,分两种情况
            if (this.mol(A, B) >= this.mol(A, P)) return PointAndLine.Extension_line;   //如果AB的模小于AP的模, 那么p在线段AB的延长线上
		    else  return PointAndLine.Line;                                             //p在线段AB上(不含两端)
	    }
    }

    //已知向量求角度()
    static vectorsToDegress (dir: cc.Vec2): number {
        let comVec = cc.v2(0, -1);                      // 水平向左的对比向量
        let radian = comVec.signAngle(dir);             // 求方向向量与对比向量间的弧度
        let degree = cc.misc.radiansToDegrees(radian);  // 将弧度转换为角度
        return degree;
    }
}