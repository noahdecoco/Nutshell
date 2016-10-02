(function(window){

	'use strict';

	let Noix = function(appId, config){

		if(typeof appId != 'string') {
			console.error('Error initializing Noix App : App Id must be a string');
			return;
		}

		if(typeof config != 'undefined' && typeof config != 'object') {
			console.error('Error initializing Noix App : Config must be an object');
			return;
		}

		if(typeof config.debugMode != 'undefined' && typeof config.debugMode != 'boolean') {
			console.warn('Warning: config.debugMode needs to be a true or false');
			return;
		}

		// Private Variables
		let _appId    = appId;
		let _config   = config;
		let _events   = {};
		let _services = {};
		let _modules  = {};

		//////////////////////////////////////////////////////////////////
		// DEBUG /////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _debug = function(msg,type='log'){
			if (type != 'log' && type != 'warn' && type != 'error') return;
			if (typeof _config.debugMode != 'boolean') return;
			if (typeof msg == 'object') console[type].apply(console, msg);
			else if (typeof msg == 'string') console[type](msg);
		}

		//////////////////////////////////////////////////////////////////
		// EVENTS ////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _registerEvent = function(evtId, callback){

			if(typeof evtId != 'string'){
				_debug(`Error registering event '${evtId}', evtId must be a string.`,'error');
				return;
			}

			if(typeof callback != 'function'){
				_debug(`Error registering event '${evtId}', callback must be a function.`,'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined') _events[evtId] = [];
			_events[evtId].push(callback);
		}

		let _triggerEvent = function(evtId, params){

			if(typeof evtId != 'string'){
				_debug(`Error triggering event '${evtId}', evtId must be a string.`,'error');
				return;
			}

			if(typeof params != 'undefined' && typeof params != 'object'){
				_debug(`Error triggering event '${evtId}', params must be an array.`,'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug(`'${evtId}' wasn't triggered since no event with that id has been registered.`,'warn');
				return;
			}

			for(let i = 0; i < _events[evtId].length; i++){
				_events[evtId][i].apply({}, params);
			}
		}

		let _deleteEvent = function(evtId){

			if(typeof evtId != 'string'){
				_debug(`Error deleting event '${evtId}', evtId must be a string.`,'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug(`'${evtId}' wasn't deleted since no event with that id has been registered.`,'warn');
				return;
			}

			delete _events[evtId];
		}

		let _unregisterEvent = function(evtId, callback){

			if(typeof evtId != 'string'){
				_debug(`Error unregistering event '${evtId}', evtId must be a string.`,'error');
				return;
			}

			if(typeof callback != 'function'){
				_debug(`Error unregistering event '${evtId}', callback must be a function.`,'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug(`'${evtId}' wasn't unregistered since no event with that id has been registered.`,'warn');
				return;
			}

			let exists = false;
			for(let i = 0; i < _events[evtId].length; i++){
				if(_events[evtId][i] == callback){
					_events[evtId].splice(i,1);
					exists = true;
				}
			}
			if (!exists) {
				_debug(`Callback wasn't removed as a listener from event '${evtId}' since it wasn't listening to it.`,'warn');
			}
		}

		//////////////////////////////////////////////////////////////////
		// SERVICES //////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _addService = function(serId, creator){
			
			if(typeof serId != 'string'){
				_debug(`Error registering service '${serId}', serId must be a string.`,'error');
				return;
			}

			if(typeof creator != 'function'){
				_debug(`Error registering service '${serId}', creator must be a function.`,'error');
				return;
			}

			if(typeof _services[serId] != 'undefined'){
				_debug(`Error registering service '${serId}', serId already registered.`,'error');
				return;
			}

			_services[serId] = creator();
		};

		let _getService = function(serId){
			return _services[serId];
		}

		let _destroyService = function(serId){
			delete _services[serId];
		};

		//////////////////////////////////////////////////////////////////
		// MODULES ///////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _addModule = function(modId, creator){
			_modules[modId] = {
				create: creator,
				instance: null
			}
		};

		let _initModule = function(modId, creator){
			_modules[modId].instance = _modules[modId].create(new _context());
			_modules[modId].instance.init();
		};

		let _destroyModule = function(modId, creator){
			_modules[modId].instance.destroy();
			_modules[modId].instance = null;
		};

		//////////////////////////////////////////////////////////////////
		// CONTEXT ///////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		// These methods are available inside modules and services
		let _context = function(){
			return {
				// Events
				registerEvent   : _registerEvent,
				triggerEvent    : _triggerEvent,
				deleteEvent     : _deleteEvent,
				unregisterEvent : _unregisterEvent,
				// Services
				addService      : _addService,
				getService      : _getService,
				destroyService  : _destroyService,
				// Modules
				addModule       : _addModule,
				initModule      : _initModule,
				destroyModule   : _destroyModule
			}
		}

		//////////////////////////////////////////////////////////////////
		// API ///////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		// These methods are available outside the app
		let _api = (function(){
			return {
				debug           : _debug,
				// Events
				registerEvent   : _registerEvent,
				triggerEvent    : _triggerEvent,
				deleteEvent     : _deleteEvent,
				unregisterEvent : _unregisterEvent,
				// Services
				addService      : _addService,
				getService      : _getService,
				destroyService  : _destroyService,
				// Modules
				addModule       : _addModule,
				initModule      : _initModule,
				destroyModule   : _destroyModule
			}
		}())

		_debug([`"${_appId}" initialised! Config`, _config]);
		return _api;

	};

	window.Noix = Noix;

}(typeof window !== 'undefined' ? window : this));