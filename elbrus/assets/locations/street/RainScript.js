cc.Class({
    extends: cc.Component,

    properties: {
    },

    start : function() {
        var ps = this.getComponent(cc.ParticleSystem);
        var stress = cc.player.getNormalizedStress();
        ps.posVar = new cc.Vec2(this.node.parent.width * 0.5, 0);
        ps.emissionRate *= (ps.posVar.x / 300);
        ps.emissionRate *= cc.lerp(1, 3, stress);
		ps.emissionRate = Math.min(1500, ps.emissionRate);
        this.node.scaleY *= cc.lerp(1, 3, stress * stress * stress);
        cc.ps = ps;
		this.node.parent.on('size-changed', ()=>{
			ps.posVar = new cc.Vec2(this.node.parent.width * 0.5, 0);
			ps.emissionRate *= (ps.posVar.x / 300);
			ps.emissionRate *= cc.lerp(1, 3, stress);
			ps.emissionRate = Math.min(1500, ps.emissionRate);
			this.node.scaleY *= cc.lerp(1, 3, stress * stress * stress);			
		})
    }
});
