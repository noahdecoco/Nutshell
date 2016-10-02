var app = new Noix('app', {debugMode:true});

// Events
let foo = function(msg, num){
	app.debug([msg, num + ' time'], 'log');
};

app.registerEvent('foo', foo);
app.triggerEvent('foo', ['Event "foo" triggered', 1]);
app.unregisterEvent('foo',foo);
app.deleteEvent('foo');