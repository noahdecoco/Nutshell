(function(window){

	'use strict';

	let Noix = function(appId, config){

		// Private Variables
		let _appId    = appId;
		let _config   = config;
		let _events   = {};
		let _modules  = {};
		let _services = {};

		//////////////////////////////////////////////////////////////////
		// DEBUG /////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _debug = function(msg,type='log'){
			if(type != 'log' && type != 'warn' && type != 'error') return false;
			if(_config.debugMode) console[type](msg);
		}

		//////////////////////////////////////////////////////////////////
		// EVENTS ////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _registerEvent = function(evtId, callback){
			if(typeof _events[evtId] == 'undefined') _events[evtId] = [];
			_events[evtId].push(callback);
		}

		let _triggerEvent = function(evtId, params){
			if(typeof _events[evtId] != 'undefined'){
				for(let i = 0; i < _events[evtId].length; i++){
					_events[evtId][i].apply({}, params);
				}
			}
		}

		let _deleteEvent = function(evtId){
			if(typeof _events[evtId] != 'undefined') delete _events[evtId];
		}

		let _unregisterEvent = function(evtId, callback){
			if(typeof _events[evtId] != 'undefined'){
				for(let i = 0; i < _events[evtId].length; i++){
					if(_events[evtId][i] == callback){
						_events[evtId].splice(i,1);
					}
				}
			}
		}

		//////////////////////////////////////////////////////////////////
		// SERVICES //////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		let _addService = function(serId, creator){
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

		return _api;

	};

	window.Noix = Noix;

}(typeof window !== 'undefined' ? window : this));