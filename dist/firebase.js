(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dbdi"] = factory();
	else
		root["dbdi"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"firebase": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	var jsonpArray = window["webpackJsonpdbdi"] = window["webpackJsonpdbdi"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1,"_vendor","_common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./firebase/FirebaseDataProvider.js":
/*!******************************************!*\
  !*** ./firebase/FirebaseDataProvider.js ***!
  \******************************************/
/*! exports provided: default, FirebaseAuthProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FirebaseDataProvider; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FirebaseAuthProvider\", function() { return FirebaseAuthProvider; });\n/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ \"../node_modules/core-js/modules/es7.symbol.async-iterator.js\");\n/* harmony import */ var core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_symbol_async_iterator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.symbol */ \"../node_modules/core-js/modules/es6.symbol.js\");\n/* harmony import */ var core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_symbol__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.promise */ \"../node_modules/core-js/modules/es6.promise.js\");\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var core_js_modules_es6_object_define_property__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.object.define-property */ \"../node_modules/core-js/modules/es6.object.define-property.js\");\n/* harmony import */ var core_js_modules_es6_object_define_property__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_define_property__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var core_js_modules_es6_object_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.object.create */ \"../node_modules/core-js/modules/es6.object.create.js\");\n/* harmony import */ var core_js_modules_es6_object_create__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_create__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var core_js_modules_es6_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.object.set-prototype-of */ \"../node_modules/core-js/modules/es6.object.set-prototype-of.js\");\n/* harmony import */ var core_js_modules_es6_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! regenerator-runtime/runtime */ \"../node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es6.function.name */ \"../node_modules/core-js/modules/es6.function.name.js\");\n/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! firebase/app */ \"../node_modules/firebase/app/dist/index.cjs.js\");\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! firebase/auth */ \"../node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! firebase/database */ \"../node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./firebase-util */ \"./firebase/firebase-util.js\");\n/* harmony import */ var _dataProviders_DataProviderBase__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../dataProviders/DataProviderBase */ \"./dataProviders/DataProviderBase.js\");\n/* harmony import */ var lodash_isString__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lodash/isString */ \"../node_modules/lodash/isString.js\");\n/* harmony import */ var lodash_isString__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(lodash_isString__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var lodash_isPlainObject__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash/isPlainObject */ \"../node_modules/lodash/isPlainObject.js\");\n/* harmony import */ var lodash_isPlainObject__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(lodash_isPlainObject__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var src_util_auto_bind__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! src/util/auto-bind */ \"./util/auto-bind.js\");\n/* harmony import */ var _PathUtil__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../PathUtil */ \"./PathUtil.js\");\n\n\n\n\n\n\n\n\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\n\n\n\n\n/**\n * TODO: advanced features:\n *  implicit (one-to-one + one-to-many) indices\n *  explicit (many-to-many) indices\n *  groupBy\n */\n\n/**\n * The FirebaseDataProvider allows \n */\n\nvar FirebaseDataProvider =\n/*#__PURE__*/\nfunction (_DataProviderBase) {\n  _inherits(FirebaseDataProvider, _DataProviderBase);\n\n  function FirebaseDataProvider(app) {\n    var _this;\n\n    _classCallCheck(this, FirebaseDataProvider);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(FirebaseDataProvider).call(this));\n\n    _defineProperty(_assertThisInitialized(_this), \"_database\", void 0);\n\n    _defineProperty(_assertThisInitialized(_this), \"actions\", {\n      set: function set(remotePath, val) {\n        var ref = _this._getRefByPath(remotePath);\n\n        var promise = ref.set(val);\n\n        _this._onWrite('Set', remotePath, val);\n\n        return promise;\n      },\n      push: function push(remotePath, val) {\n        var ref = _this._getRefByPath(remotePath);\n\n        var promise = ref.push(val);\n\n        _this._onWrite('Pus', remotePath, val);\n\n        return promise;\n      },\n      update: function update(remotePath, val) {\n        var ref = _this.database().ref().child(remotePath);\n\n        var promise = ref.update(val);\n\n        _this._onWrite('Upd', remotePath, val);\n\n        return promise;\n      },\n      delete: function _delete(remotePath) {\n        var ref = _this.database().ref().child(remotePath);\n\n        var promise = ref.set(null);\n\n        _this._onWrite('Del', remotePath);\n\n        return promise;\n      },\n      transaction: function transaction() {// TODO\n      },\n      batchUpdate: function batchUpdate() {// TODO\n      }\n    });\n\n    if (app) {\n      _this._database = firebase_app__WEBPACK_IMPORTED_MODULE_8___default.a.database(app);\n    }\n\n    Object(src_util_auto_bind__WEBPACK_IMPORTED_MODULE_15__[\"default\"])(_assertThisInitialized(_this));\n    return _this;\n  }\n\n  _createClass(FirebaseDataProvider, [{\n    key: \"database\",\n    value: function database() {\n      if (!this._database) {\n        this._database = firebase_app__WEBPACK_IMPORTED_MODULE_8___default.a.database();\n      }\n\n      return this._database;\n    } // ################################################\n    // Private properties + methods\n    // ################################################\n\n  }, {\n    key: \"_onNewData\",\n    value: function _onNewData(query, snap) {\n      var val = snap.val();\n\n      if (val === _dataProviders_DataProviderBase__WEBPACK_IMPORTED_MODULE_12__[\"NOT_LOADED\"]) {\n        // this path is loaded -> make sure, it does not get a NOT_LOADED value\n        val = null;\n      } //console.log('onNewData', query.remotePath, val);\n\n\n      this.notifyNewData(query, val);\n    }\n  }, {\n    key: \"_onError\",\n    value: function _onError(err) {\n      console.error(\"[\".concat(this.constructor.name, \"] \").concat(err.stack));\n    }\n  }, {\n    key: \"_getRefByQuery\",\n    value: function _getRefByQuery(query) {\n      var remotePath = query.remotePath,\n          queryParams = query.queryInput.queryParams;\n      var ref = this.database().ref().child(remotePath);\n\n      if (queryParams) {\n        ref = Object(_firebase_util__WEBPACK_IMPORTED_MODULE_11__[\"applyParamsToQuery\"])(queryParams, ref);\n      }\n\n      return ref;\n    } // ################################################\n    // Public properties + methods\n    // ################################################\n\n  }, {\n    key: \"fetchOnce\",\n    value: function () {\n      var _fetchOnce = _asyncToGenerator(\n      /*#__PURE__*/\n      regeneratorRuntime.mark(function _callee(queryInput) {\n        var q, ref, snap;\n        return regeneratorRuntime.wrap(function _callee$(_context) {\n          while (1) {\n            switch (_context.prev = _context.next) {\n              case 0:\n                q = this.justGimmeAQuery(queryInput);\n                ref = this._getRefByQuery(q);\n                _context.next = 4;\n                return ref.once('value');\n\n              case 4:\n                snap = _context.sent;\n                return _context.abrupt(\"return\", snap.val());\n\n              case 6:\n              case \"end\":\n                return _context.stop();\n            }\n          }\n        }, _callee, this);\n      }));\n\n      function fetchOnce(_x) {\n        return _fetchOnce.apply(this, arguments);\n      }\n\n      return fetchOnce;\n    }()\n    /**\n     * A listener started listening on a path for the fast time\n     */\n\n  }, {\n    key: \"onPathListenStart\",\n    value: function onPathListenStart(query, firstListener) {\n      var _this2 = this;\n\n      var hook = function hook(snap) {\n        return _this2._onNewData(query, snap);\n      };\n\n      var ref = this._getRefByQuery(query);\n\n      ref.on('value', hook, this._onError);\n      return hook;\n    }\n    /**\n     * Not a single soul cares about the localPath in the given query anymore\n     */\n\n  }, {\n    key: \"onPathListenEnd\",\n    value: function onPathListenEnd(query, hook) {\n      var ref = this._getRefByQuery(query);\n\n      ref.off('value', hook);\n    }\n    /**\n     * The way the Firebase library (currently) works is that\n     * setting something will trigger events on any `child` listeners at the given path.\n     * That is why we don't need to explicitely trigger anything during write operations.\n     */\n\n  }, {\n    key: \"_onWrite\",\n    value: function _onWrite(action, remotePath, val) {\n      console.log('W [', action, remotePath, '] ', val); // send a notification early\n      //  because it can save us the time of a round-trip to the database (which is on('value') fires)\n      //  TODO: insufficient since cache has not been updated yet, also does not move up the hierarchy.\n      //this.markPossibleUpdate(remotePath);\n\n      return true;\n    }\n  }, {\n    key: \"_getRefByPath\",\n    value: function _getRefByPath(remotePath) {\n      var ref = this.database().ref().child(remotePath);\n      return ref;\n    }\n  }]);\n\n  return FirebaseDataProvider;\n}(_dataProviders_DataProviderBase__WEBPACK_IMPORTED_MODULE_12__[\"default\"]);\n\n\nvar FirebaseAuthProvider =\n/*#__PURE__*/\nfunction (_DataProviderBase2) {\n  _inherits(FirebaseAuthProvider, _DataProviderBase2);\n\n  function FirebaseAuthProvider(app) {\n    var _this3;\n\n    _classCallCheck(this, FirebaseAuthProvider);\n\n    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FirebaseAuthProvider).call(this));\n\n    _defineProperty(_assertThisInitialized(_this3), \"_auth\", void 0);\n\n    if (app) {\n      _this3._auth = firebase_app__WEBPACK_IMPORTED_MODULE_8___default.a.auth(app);\n    }\n\n    Object(src_util_auto_bind__WEBPACK_IMPORTED_MODULE_15__[\"default\"])(_assertThisInitialized(_this3));\n    return _this3;\n  }\n\n  _createClass(FirebaseAuthProvider, [{\n    key: \"fetchOnce\",\n    value: function () {\n      var _fetchOnce2 = _asyncToGenerator(\n      /*#__PURE__*/\n      regeneratorRuntime.mark(function _callee2(queryInput) {\n        var _this4 = this;\n\n        var query;\n        return regeneratorRuntime.wrap(function _callee2$(_context2) {\n          while (1) {\n            switch (_context2.prev = _context2.next) {\n              case 0:\n                query = this.justGimmeAQuery(queryInput);\n                return _context2.abrupt(\"return\", new Promise(function (resolve, reject) {\n                  var unsubscribe;\n                  unsubscribe = _this4.auth().onAuthStateChanged(function (user) {\n                    _this4._onNewData(query, user);\n\n                    unsubscribe();\n                    resolve(Object(_PathUtil__WEBPACK_IMPORTED_MODULE_16__[\"getDataIn\"])(user, query.remotePath, null));\n                  }, function (err) {\n                    unsubscribe();\n                    reject(err);\n                  });\n                }));\n\n              case 2:\n              case \"end\":\n                return _context2.stop();\n            }\n          }\n        }, _callee2, this);\n      }));\n\n      function fetchOnce(_x2) {\n        return _fetchOnce2.apply(this, arguments);\n      }\n\n      return fetchOnce;\n    }()\n  }, {\n    key: \"auth\",\n    value: function auth() {\n      if (!this._auth) {\n        this._auth = firebase_app__WEBPACK_IMPORTED_MODULE_8___default.a.auth();\n      }\n\n      return this._auth;\n    }\n  }, {\n    key: \"_onNewData\",\n    value: function _onNewData(query, user) {\n      this.notifyNewData(this.getOrCreateQuery(''), user || null);\n      this.notifyNewData(query, user && Object(_PathUtil__WEBPACK_IMPORTED_MODULE_16__[\"getDataIn\"])(user, query.remotePath, null) || user);\n    }\n  }, {\n    key: \"onPathListenStart\",\n    value: function onPathListenStart(query, listener) {\n      var _this5 = this;\n\n      // add listener once the first request comes in\n      this.auth().onAuthStateChanged(function (user) {\n        _this5._onNewData(query, user);\n      });\n    }\n  }, {\n    key: \"_onError\",\n    value: function _onError(err) {\n      console.error(\"[\".concat(this.constructor.name, \"] \").concat(err.stack));\n    }\n  }]);\n\n  return FirebaseAuthProvider;\n}(_dataProviders_DataProviderBase__WEBPACK_IMPORTED_MODULE_12__[\"default\"]);\n\n//# sourceURL=webpack://dbdi/./firebase/FirebaseDataProvider.js?");

/***/ }),

/***/ "./firebase/firebase-util.js":
/*!***********************************!*\
  !*** ./firebase/firebase-util.js ***!
  \***********************************/
/*! exports provided: applyParamsToQuery, applyQueryToDataSet, signIn, signInWithGoogle, isAuthenticated */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyParamsToQuery\", function() { return applyParamsToQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyQueryToDataSet\", function() { return applyQueryToDataSet; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"signIn\", function() { return signIn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"signInWithGoogle\", function() { return signInWithGoogle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isAuthenticated\", function() { return isAuthenticated; });\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ \"../node_modules/regenerator-runtime/runtime.js\");\n/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.promise */ \"../node_modules/core-js/modules/es6.promise.js\");\n/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es6_function_bind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.function.bind */ \"../node_modules/core-js/modules/es6.function.bind.js\");\n/* harmony import */ var core_js_modules_es6_function_bind__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_bind__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ \"../node_modules/core-js/modules/web.dom.iterable.js\");\n/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.array.for-each */ \"../node_modules/core-js/modules/es6.array.for-each.js\");\n/* harmony import */ var core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var lodash_map__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/map */ \"../node_modules/lodash/map.js\");\n/* harmony import */ var lodash_map__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_map__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var lodash_sortBy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash/sortBy */ \"../node_modules/lodash/sortBy.js\");\n/* harmony import */ var lodash_sortBy__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash_sortBy__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash/filter */ \"../node_modules/lodash/filter.js\");\n/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash_filter__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var lodash_take__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash/take */ \"../node_modules/lodash/take.js\");\n/* harmony import */ var lodash_take__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash_take__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var lodash_takeRight__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash/takeRight */ \"../node_modules/lodash/takeRight.js\");\n/* harmony import */ var lodash_takeRight__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(lodash_takeRight__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! firebase/app */ \"../node_modules/firebase/app/dist/index.cjs.js\");\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! firebase/auth */ \"../node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var src_util__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/util */ \"./util/index.js\");\n\n\n\n\n\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\n\n\n/**\n * First version credit goes to react-redux-firebase!\n * TODO: Make this more performant + stabler\n * \n * @see https://github.com/prescottprue/react-redux-firebase/tree/master/src/utils/query.js#L123\n * \n * @param {*} queryParams \n * @param {*} query \n */\n\nfunction applyParamsToQuery(queryParams, query) {\n  try {\n    queryParams.forEach(function (param) {\n      switch (param[0]) {\n        case 'orderByValue':\n          query = query.orderByValue();\n          break;\n\n        case 'orderByPriority':\n          query = query.orderByPriority();\n          break;\n\n        case 'orderByKey':\n          query = query.orderByKey();\n          break;\n\n        case 'orderByChild':\n          query = query.orderByChild(param[1]);\n          break;\n\n        case 'limitToFirst':\n          // TODO: Handle number not being passed as param\n          query = query.limitToFirst(parseInt(param[1], 10));\n          break;\n\n        case 'limitToLast':\n          // TODO: Handle number not being passed as param\n          query = query.limitToLast(parseInt(param[1], 10));\n          break;\n\n        case 'equalTo':\n          var equalToParam = param[1];\n          query = param.length === 3 ? query.equalTo(equalToParam, param[2]) : query.equalTo(equalToParam);\n          break;\n\n        case 'startAt':\n          var startAtParam = param[1];\n          query = param.length === 3 ? query.startAt(startAtParam, param[2]) : query.startAt(startAtParam);\n          break;\n\n        case 'endAt':\n          var endAtParam = param[1];\n          query = param.length === 3 ? query.endAt(endAtParam, param[2]) : query.endAt(endAtParam);\n          break;\n\n        default:\n          throw new Error('unknown query argument: ' + param[0]);\n      }\n    });\n  } catch (err) {\n    throw new Error(\"invalid query (\".concat(err.message, \") @ \\\"\").concat(query, \"\\\" - \\n\").concat(JSON.stringify(queryParams, null, 2)));\n  }\n\n  return query;\n}\nvar objectSelectors = {\n  orderByValue: function orderByValue(__, _, obj) {\n    return obj.val;\n  },\n  orderByPriority: function orderByPriority(__, _, obj) {\n    // NYI\n    console.error('[NYI] orderByPriority is not implemented in dbdi-firebase');\n    return 0;\n  },\n  orderByKey: function orderByKey(__, _, obj) {\n    return obj.key;\n  },\n  orderByChild: function orderByChild(child, _, obj) {\n    return obj.val[child];\n  }\n};\nvar filters = {\n  limitToFirst: function limitToFirst(limit, selectorFn, result) {\n    return lodash_take__WEBPACK_IMPORTED_MODULE_8___default()(result, limit);\n  },\n  limitToLast: function limitToLast(limit, selectorFn, result) {\n    return lodash_takeRight__WEBPACK_IMPORTED_MODULE_9___default()(result, limit);\n  },\n  equalTo: function equalTo(filterVal, selectorFn, result) {\n    return lodash_filter__WEBPACK_IMPORTED_MODULE_7___default()(result, function (obj) {\n      return selectorFn(obj) === filterVal;\n    });\n  },\n  startAt: function startAt(filterVal, selectorFn, result) {\n    return lodash_filter__WEBPACK_IMPORTED_MODULE_7___default()(result, function (obj) {\n      return selectorFn(obj) >= filterVal;\n    });\n  },\n  endAt: function endAt(filterVal, selectorFn, result) {\n    return lodash_filter__WEBPACK_IMPORTED_MODULE_7___default()(result, function (obj) {\n      return selectorFn(obj) <= filterVal;\n    });\n  }\n};\nfunction applyQueryToDataSet(data, queryParams) {\n  // convert object to array\n  var result = lodash_map__WEBPACK_IMPORTED_MODULE_5___default()(data, function (val, key) {\n    return {\n      key: key,\n      val: val\n    };\n  }); // determine filters + selectors\n  //let sortFn;\n\n  var selectorFn;\n  var filterFns = [];\n  queryParams.forEach(function (param) {\n    param = param || src_util__WEBPACK_IMPORTED_MODULE_12__[\"EmptyArray\"]; //sortFn = sorters[param[0]].bind(null, param[1], param[2]) || sortFn;\n\n    selectorFn = objectSelectors[param[0]].bind(null, param[1], param[2]) || selectorFn;\n    filters[param[0]] && filterFns.push(filters[param[0]].bind(null, param[1]));\n  }); // first sort (because some filters require sorting before being effective)\n\n  if (selectorFn) {\n    result = lodash_sortBy__WEBPACK_IMPORTED_MODULE_6___default()(result, selectorFn);\n  } // then filter\n\n\n  filterFns.forEach(function (filterFn) {\n    return result = filterFn(selectorFn, result);\n  });\n  return result;\n} // Sign in + auth stuff\n\nfunction signIn(_x) {\n  return _signIn.apply(this, arguments);\n} // export function signInWithGithub() {\n//   return authenticate(new getFirebase().auth.GithubAuthProvider());\n// };\n\nfunction _signIn() {\n  _signIn = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee(provider) {\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            _context.next = 3;\n            return firebase_app__WEBPACK_IMPORTED_MODULE_10___default.a.auth().signInWithRedirect(provider);\n\n          case 3:\n            return _context.abrupt(\"return\", _context.sent);\n\n          case 6:\n            _context.prev = 6;\n            _context.t0 = _context[\"catch\"](0);\n            throw new Error('Unable to login ' + (_context.t0 && _context.t0.stack || _context.t0));\n\n          case 9:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, this, [[0, 6]]);\n  }));\n  return _signIn.apply(this, arguments);\n}\n\nfunction signInWithGoogle() {\n  return signIn(new firebase_app__WEBPACK_IMPORTED_MODULE_10___default.a.auth.GoogleAuthProvider());\n} // export function signInWithTwitter() {\n//   return authenticate(new getFirebase().auth.TwitterAuthProvider());\n// };\n\nfunction isAuthenticated() {\n  // TODO: support multiple apps\n  return !!firebase_app__WEBPACK_IMPORTED_MODULE_10___default.a.auth().currentUser;\n}\n\n//# sourceURL=webpack://dbdi/./firebase/firebase-util.js?");

/***/ }),

/***/ 1:
/*!****************************************************************************!*\
  !*** multi ./firebase/firebase-util.js ./firebase/FirebaseDataProvider.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /Users/domi/code/dbdi/src/firebase/firebase-util.js */\"./firebase/firebase-util.js\");\nmodule.exports = __webpack_require__(/*! /Users/domi/code/dbdi/src/firebase/FirebaseDataProvider.js */\"./firebase/FirebaseDataProvider.js\");\n\n\n//# sourceURL=webpack://dbdi/multi_./firebase/firebase-util.js_./firebase/FirebaseDataProvider.js?");

/***/ })

/******/ });
});