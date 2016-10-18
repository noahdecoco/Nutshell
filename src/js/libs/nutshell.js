(function(window){

	'use strict';

	var Nutshell = function(appId, config){

		if(typeof appId != 'string') {
			console.error('Error initializing Nutshell App : App Id must be a string');
			return;
		}

		if(typeof config != 'undefined' && typeof config != 'object') {
			console.error('Error initializing Nutshell App : Config must be an object');
			return;
		}

		if(typeof config.debugMode != 'undefined' && typeof config.debugMode != 'boolean') {
			console.warn('Warning: config.debugMode needs to be a true or false');
			return;
		}

		// Private Variables
		var _appId    = appId;
		var _config   = config;
		var _events   = {};
		var _services = {};
		var _modules  = {};

		//////////////////////////////////////////////////////////////////
		// DEBUG /////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _debug = function(msg,type){
			type? type = 'log' : type = type;
			if (type != 'log' && type != 'warn' && type != 'error') return;
			if (typeof _config.debugMode != 'boolean') return;
			if (typeof msg == 'object') console[type].apply(console, msg);
			else if (typeof msg == 'string') console[type](msg);
		}

		//////////////////////////////////////////////////////////////////
		// CONFIG ////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _appConfig = (function(){
			return Object.freeze(_config);
		})()

		//////////////////////////////////////////////////////////////////
		// EVENTS ////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _registerEvent = function(evtId, callback){

			if(typeof evtId != 'string'){
				_debug("Error registering event '"+evtId+"', evtId must be a string.",'error');
				return;
			}

			if(typeof callback != 'function'){
				_debug("Error registering event '"+evtId+"', callback must be a function.",'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined') _events[evtId] = [];
			_events[evtId].push(callback);
		}

		var _triggerEvent = function(evtId, params){

			if(typeof evtId != 'string'){
				_debug("Error triggering event '"+evtId+"', evtId must be a string.",'error');
				return;
			}

			if(typeof params != 'undefined' && typeof params != 'object'){
				_debug("Error triggering event '"+evtId+"', params must be an array.",'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug("'"+evtId+"' wasn't triggered since no event with that id has been registered.",'warn');
				return;
			}

			for(var i = 0; i < _events[evtId].length; i++){
				_events[evtId][i].apply({}, params);
			}
		}

		var _deleteEvent = function(evtId){

			if(typeof evtId != 'string'){
				_debug("Error deleting event '"+evtId+"', evtId must be a string.",'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug("'"+evtId+"' wasn't deleted since no event with that id has been registered.",'warn');
				return;
			}

			delete _events[evtId];
		}

		var _unregisterEvent = function(evtId, callback){

			if(typeof evtId != 'string'){
				_debug("Error unregistering event '"+evtId+"', evtId must be a string.",'error');
				return;
			}

			if(typeof callback != 'function'){
				_debug("Error unregistering event '"+evtId+"', callback must be a function.",'error');
				return;
			}

			if(typeof _events[evtId] == 'undefined'){
				_debug("'"+evtId+"' wasn't unregistered since no event with that id has been registered.",'warn');
				return;
			}

			var exists = false;
			for(var i = 0; i < _events[evtId].length; i++){
				if(_events[evtId][i] == callback){
					_events[evtId].splice(i,1);
					exists = true;
				}
			}
			if (!exists) {
				_debug("Callback wasn't removed as a listener from event '"+evtId+"' since it wasn't listening to it.",'warn');
			}
		}

		//////////////////////////////////////////////////////////////////
		// SERVICES //////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _registerService = function(serId, creator){
			
			if(typeof serId != 'string'){
				_debug("Error registering service '${serId}', serId must be a string.",'error');
				return;
			}

			if(typeof creator != 'function'){
				_debug("Error registering service '${serId}', creator must be a function.",'error');
				return;
			}

			if(typeof _services[serId] != 'undefined'){
				_debug("Error registering service '${serId}', serId already registered.",'error');
				return;
			}

			_services[serId] = creator();
		};

		var _getService = function(serId){

			if(typeof serId != 'string'){
				_debug("Error getting service '${serId}', serId must be a string.",'error');
				return;
			}
			
			if(typeof _services[serId] == 'undefined'){
				_debug("Error getting service '${serId}', it hasn't been registered.",'error');
				return;
			}

			return _services[serId];
		}

		var _unregisterService = function(serId){

			if(typeof serId != 'string'){
				_debug("Error destroying service '${serId}', serId must be a string.",'error');
				return;
			}
			
			if(typeof _services[serId] == 'undefined'){
				_debug("Couldn't destroy service '${serId}' since it didn't exist.",'warn');
				return;
			}

			delete _services[serId];
		};

		//////////////////////////////////////////////////////////////////
		// MODULES ///////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _registerModule = function(modId, creator, isScoped){

			if(typeof modId != 'string'){
				_debug("Error registering module '${modId}', modId must be a string.",'error');
				return;
			}

			if(typeof creator != 'function'){
				_debug("Error registering module '${modId}', creator must be a function.",'error');
				return;
			}

			if(typeof _modules[modId] != 'undefined'){
				_debug("Error registering module '${modId}', modId already registered.",'error');
				return;
			}

			_modules[modId] = {
				create: creator,
				instance: null,
				isScoped: isScoped
			}
		};

		var _initModule = function(modId){

			if(typeof modId != 'string'){
				_debug("Error initialising module '${modId}', modId must be a string.",'error');
				return;
			}

			if(typeof _modules[modId] == 'undefined'){
				_debug("Error initialising module '${modId}', modId isn't registered.",'error');
				return;
			}

			if(_modules[modId].instance != null){
				_debug("Error initialising module '${modId}', modId already initialized.",'error');
				return;
			}

			var scope = document.querySelector('#'+modId);
			_modules[modId].instance = _modules[modId].create(new _context(scope));
			_modules[modId].instance.init();
		};

		var _initAllModules = function(){
			for (var mod in _modules) {
				_initModule(String(mod));
			}
		};

		var _unregisterModule = function(modId){

			if(typeof modId != 'string'){
				_debug("Error unregistering module '${modId}', modId must be a string.",'error');
				return;
			}

			if(typeof _modules[modId] == 'undefined'){
				_debug("Error unregistering module '${modId}', modId hasn't been registered.",'warn');
				return;
			}

			_modules[modId].instance.destroy();
			_modules[modId].instance = null;
		};

		var _unregisterAllModules = function(){

		};

		//////////////////////////////////////////////////////////////////
		// DOM ///////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		var _querySelector = function(query){
			return this.scope.querySelector(query);
		};

		//////////////////////////////////////////////////////////////////
		// CONTEXT ///////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		// These methods are available inside modules and services
		var _context = function(scope){
			
			return {
				// Scope
				scope             : scope,
				// Config
				appConfig         : _appConfig,
				// Events
				registerEvent     : _registerEvent,
				triggerEvent      : _triggerEvent,
				deleteEvent       : _deleteEvent,
				unregisterEvent   : _unregisterEvent,
				// Services
				registerService   : _registerService,
				getService        : _getService,
				unregisterService : _unregisterService,
				// Modules
				registerModule    : _registerModule,
				initModule        : _initModule,
				unregisterModule  : _unregisterModule,
				// DOM
				querySelector     : _querySelector
			}
		}

		//////////////////////////////////////////////////////////////////
		// API ///////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		// These methods are available outside the app
		var _api = (function(){
			return {
				debug             : _debug,
				// Events
				registerEvent     : _registerEvent,
				triggerEvent      : _triggerEvent,
				deleteEvent       : _deleteEvent,
				unregisterEvent   : _unregisterEvent,
				// Services
				registerService   : _registerService,
				getService        : _getService,
				unregisterService : _unregisterService,
				// Modules
				registerModule    : _registerModule,
				initModule        : _initModule,
				unregisterModule  : _unregisterModule,
				// Start/Stop
				start             : _initAllModules,
				destroy           : _unregisterAllModules
			}
		}())

		_debug(["'"+_appId+"' initialised! Config", _config]);
		return _api;

	};

	window.Nutshell = Nutshell;

}(typeof window !== 'undefined' ? window : this));