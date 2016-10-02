var app = new Noix('app', {debugMode:true});

// Events
let foo = function(msg, date){
	app.debug([msg, date], 'log');
};

app.registerEvent('foo', foo);
app.triggerEvent('foo', ['Event "foo" triggered on', new Date()]);
app.unregisterEvent('foo',foo);
app.deleteEvent('foo');

// Services
app.registerService('bar', function(context){
	let _data = 'This could be any useful data!';
	let _getData = function(){
		return _data;
	}
	let _setData = function(data){
		_data = data;
	}
	return {
		getData : _getData,
		setData : _setData
	}
});

console.log(app.getService('bar').getData());
app.getService('bar').setData('Or something better ;)');
console.log(app.getService('bar').getData());
app.unregisterService('bar');

// Modules
app.registerModule('zee', function(context){
	return {
		init: function(){
			console.log('inited');
		},
		destroy: function(){
			console.log('destroyed');
		}
	}
});

app.initModule('zee');
app.unregisterModule('zee');