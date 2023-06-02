'use strict';

window.Xorshift=(function() {

	const rnd=function(x=null,y=null,z=null,w=null) {
		this.x=Boolean(x) ? x : this.x;
		this.y=Boolean(y) ? y : this.y;
		this.z=Boolean(z) ? z : this.z;
		this.w=Boolean(w) ? w : this.w;
	};

	rnd.prototype.x=123456789;
	rnd.prototype.y=362436069;
	rnd.prototype.z=521288629;
	rnd.prototype.w=88675123;

	rnd.prototype.next=function() {
		const t=this.x^(this.x<<11);
		this.x=this.y;
		this.y=this.z;
		this.z=this.w;
		return (this.w=(this.w^(this.w>>>19))^(t^(t>>>8)))>>>0;
	};

	return rnd;

})();
