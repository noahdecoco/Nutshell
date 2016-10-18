var nuts = new Nutshell('nuts-app', {debugMode:true});

///////////////
// A Service //
///////////////
nuts.registerService('nut-greetings', function(){

	// Private
	var _nutGreetings = [
		'Hello!', 'Oye!', 'Bon jour!', 'Whazzup!', 'Hi!', 'Yo!',
		'Jambo!', 'Ciao!', 'Ola!', 'Ni hao!', 'Sup!', 'Halo!'
	];

	// Public
	var _getRandomGreeting = function(){
		return _nutGreetings[Math.floor(Math.random()*_nutGreetings.length)];
	}

	var _sayHello = function(sb){
		sb.style.opacity = 1;
		sb.innerHTML = _getRandomGreeting();
		setTimeout(function(){
			sb.style.opacity = 0;
		}, 700);
	};

	return {
		sayHello          : _sayHello
	}
});

//////////////////
// Some modules //
//////////////////
nuts.registerModule('left-nut', function(context){

	var _nut, _nutGreetingService, _speechBubble;

	var _greet = function(){
		_nutGreetingService.sayHello(_speechBubble);
		context.triggerEvent('left-nut-said-something');
	}

	var _respond = function(){
		setTimeout(function(){
			_nutGreetingService.sayHello(_speechBubble);
		},700);
	}

	var _init = function(){
		_nutGreetingService = nuts.getService('nut-greetings');
		_speechBubble = context.querySelector('.speech-bubble');
		_nut = context.querySelector('#btnLeftNut');
		_nut.addEventListener('click', _greet);
		context.registerEvent('right-nut-said-something', _respond);
	}

	var _destroy = function(){
		_nut = null;
		_nutGreetingService = null;
		_speechBubble = null;
	}

	return {
		init: _init,
		destroy: _destroy
	}
});

nuts.registerModule('right-nut', function(context){

	var _nut, _nutGreetingService, _speechBubble;

	var _greet = function(){
		_nutGreetingService.sayHello(_speechBubble);
		context.triggerEvent('right-nut-said-something');
	}

	var _respond = function(){
		setTimeout(function(){
			_nutGreetingService.sayHello(_speechBubble);
		},700);
	}

	var _init = function(){
		_nutGreetingService = nuts.getService('nut-greetings');
		_speechBubble = context.querySelector('.speech-bubble');
		_nut = context.querySelector('#btnRightNut');
		_nut.addEventListener('click', _greet);
		context.registerEvent('left-nut-said-something', _respond);
	}

	var _destroy = function(){
		_nut = null;
		_nutGreetingService = null;
		_speechBubble = null;
	}

	return {
		init: _init,
		destroy: _destroy
	}
});

nuts.start(); // initialises all modules