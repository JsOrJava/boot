jl.ns("user.event");
/**
 * 事件触发基类 
 * */
user.event.observable = function(){
	
}
user.event.observable.prototype = {
	queue : [],	//队列数组
	fire: function(name,data){
		var q = this.getItem(name);
		if(!(!!q)) return;
		q.fn.apply(q.scope,(!(data instanceof Array))?[data]:data);
	},
	//添加事件
	on: function(name,fn,scope){
		this.queue.push({name:name,fn:fn,scope:scope});
	},
	//注销事件
	un: function(name){
		if(this.queue.length==0) return;
		var q = this.getItem(name);
		for(var i=0;i<this.queue.length;i++){
			if(this.queue[i].name == name){
				this.queue.splice(this.queue[i],1);
				break;
			}
		}
	},
	//获取对象
	getItem: function(name){
		var obj = null;
		for(var i=0;i<this.queue.length;i++){
			if(this.queue[i].name == name){
				obj = this.queue[i];
				break;
			}
		}
		return obj;
	}
}








