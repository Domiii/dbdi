import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import pull from 'lodash/pull';

import { EmptyObject, EmptyArray, waitAsync } from 'src/util';

import {
  getDataIn,
  setDataIn,
  getPathParent,
  getAllNodesInPath
} from '../PathUtil';

export const NOT_LOADED = undefined;

export const LoadState = {
  NotLoaded: 0,
  Fetching: 1,
  Loaded: 2
};

/**
 * The amount of time to wait before deleting data + metadata 
 * from cache after unloading (in ms)
 */
const purgeCacheDelayDefault = 60 * 1000;
//const purgeCacheDelayDefault = 10;

const fetchFailDelay = 5 * 1000;

// stop trying after a while
const fetchMaxFailCount = 10;

export default class DataProviderBase {
  _listenersByPath = {};
  _queriesByLocalPath = new Map();
  _listenerData = new Map();
  _loadState = {};
  _fetchFails = {};
  _cache = {};


  // #################################################################################################
  // Load state
  // #################################################################################################

  getLoadState(localPath) {
    return this._loadState[localPath] || LoadState.NotLoaded;
  }

  isDataLoaded(localPath) {
    return this._loadState[localPath] === LoadState.Loaded;
  }

  /**
   * Generally speaking, if data is not fully loaded under a path,
   * we don't return the incomplete version of that data, that is why we want
   * to make sure that data is loaded at path (or any ancestory) before returning it.
   */
  isDataFullyAvailable(query) {
    const {
      localPath,
      remotePath
    } = query;

    if (this.isDataLoaded(localPath)) {
      return true;
    }

    if (localPath === remotePath) {
      for (let path in getAllNodesInPath(remotePath)) {
        if (this.isDataLoaded(path)) {
          return true;
        }
      }
      return false;
    }
    else {
      // cannot reliably/easily destructure (or make sense of) a path that contains advanced query data
      return false;
    }
  }

  setLoadState(localPath, state) {
    this._loadState[localPath] = state;
  }


  // #################################################################################################
  // Query & Path management
  // #################################################################################################

  getQueryByQueryInput(queryInput) {
    const localPath = this.getLocalPath(queryInput);
    return this.getQueryByLocalPath(localPath);
  }

  getQuery(queryInput) {
    const localPath = this.getLocalPath(queryInput);
    return this.getQueryByLocalPath(localPath);
  }

  getOrCreateQuery(queryInput) {
    const localPath = this.getLocalPath(queryInput);
    return this._getOrCreateQuery(localPath, queryInput);
  }

  _getOrCreateQuery(localPath, queryInput) {
    let q = this.getQueryByLocalPath(localPath);
    if (!q) {
      q = this._registerQuery(localPath, queryInput);
    }
    return q;
  }

  getQueryByLocalPath(localPath) {
    return this._queriesByLocalPath.get(localPath);
  }

  getLocalPath(queryInput) {
    let localPath;
    if (isString(queryInput)) {
      localPath = queryInput;
    }
    else if (isPlainObject(queryInput)) {
      // local path is any unique string representation of the queryInput
      localPath = JSON.stringify(queryInput);
    }
    return localPath;
  }

  getRemotePath(queryInput) {
    let remotePath;
    if (isString(queryInput)) {
      remotePath = queryInput;
    }
    else if (isPlainObject(queryInput)) {
      // remote path is the path part of the query (which can include further arguments)
      remotePath = queryInput.path;
    }
    return remotePath;
  }

  _setQueryCache(query) {
    const {
      //queryInput,
      localPath
    } = query;
    this._queriesByLocalPath.set(localPath, query);
  }

  _buildQuery(localPath, queryInput) {
    // does not exist yet
    const remotePath = this.getRemotePath(queryInput);

    return {
      queryInput,
      localPath,
      remotePath,
      _useCount: 0
    };
  }

  _registerQuery(localPath, queryInput) {
    const cachedQuery = this._buildQuery(localPath, queryInput);
    this._setQueryCache(cachedQuery);
    return cachedQuery;
  }

  /**
   * Build + don't cache query
   */
  justGimmeAQuery(queryInput) {
    const localPath = this.getLocalPath(queryInput);
    let cachedQuery = this.getQueryByLocalPath(localPath);
    if (!cachedQuery) {
      return this._buildQuery(localPath, queryInput);
    }
    else {
      //++cachedQuery._useCount;
    }
    return cachedQuery;
  }


  // #################################################################################################
  // Listeners
  // #################################################################################################

  getListeners(localPath) {
    return this._listenersByPath[localPath];
  }

  registerListener(queryInput, listener, who) {
    console.assert(isFunction(listener), '[INTERNAL ERROR] listener must be function but found: ' + listener);

    const localPath = this.getLocalPath(queryInput);

    let listeners = this.getListeners(localPath);

    if (!listeners) {
      // first time, anyone is showing interest in this path
      this._listenersByPath[localPath] = listeners = new Set();

      // if not already listening on path, register!
      //console.warn(who, '[onPathListenStart]', localPath);

      const query = this._getOrCreateQuery(localPath, queryInput);
      const customData = this.onPathListenStart(query, listener);
      query.customData = customData;
    }

    if (listeners.has(listener) && !this._listenerData.get(listener)) {
      console.error('something wrong with registerListener:', listeners.has(listener), !!this._listenerData.get(listener));
    }
    if (!listeners.has(listener)) {
      // add listener to set (if not already listening)
      listeners.add(listener);
    }

    let listenerData = this._listenerData.get(listener);
    if (!listenerData) {
      this._listenerData.set(listener, listenerData = {
        byPath: {}
      });
    }

    if (!listenerData.byPath[localPath]) {
      this._listenerData.get(listener).byPath[localPath] = {
        //query,
      };
    }
  }

  unregisterListener(listener) {
    const listenerData = this._listenerData.get(listener);
    if (!!listenerData) {
      const byPath = listenerData.byPath;

      // we need to first copy the set of keys, since
      //    we will delete keys from byPath, thereby making an iteration on byPath 
      //    itself cause all kinds of issues...
      forEach(byPath, (pathData, localPath) => this._unregisterListenerPath(localPath, pathData, listener));
    }
  }

  _unregisterListenerPath(localPath, pathData, listener) {
    //console.log('unregister path: ' + localPath);
    const listeners = this.getListeners(localPath);

    const listenerData = this._listenerData.get(listener);

    if (!listenerData) {
      console.error('[INTERNAL ERROR] listener data not set at path: ' + localPath);
      return;
    }

    if (!listeners || !listeners.has(listener)) {
      console.error('[INTERNAL ERROR] listener not registered at path: ' + localPath);
      return;
    }

    // delete all kinds of stuff
    delete listenerData.byPath[localPath];

    if (isEmpty(listenerData.byPath)) {
      // we removed the last path for listener: delete listener, as well
      //console.warn('listeners.delete');
      listeners.delete(listener);
      this._listenerData.delete(listener);
    }

    setTimeout(() => {
      if (isEmpty(listeners)) {
        // we removed the last listener at path
        this._onPathUnused(localPath);
      }
    }, purgeCacheDelayDefault);
  }

  _onPathUnused(localPath) {
    const query = this.getQueryByLocalPath(localPath);
    if (!query) {
      // already removed
      return;
    }

    //console.log('UNLOAD', localPath);
    delete this._listenersByPath[localPath];
    this._queriesByLocalPath.delete(localPath);
    delete this._loadState[localPath];
    if (this._fetchFails[localPath]) {
      delete this._fetchFails[localPath];
    }

    this.onPathListenEnd(query, query.customData);
  }

  // #################################################################################################
  // Handle data
  // #################################################################################################

  notifyNewData(query, val) {
    const {
      localPath
    } = query || EmptyObject;

    if (val === NOT_LOADED) {
      if (this.isDataLoaded(localPath)) {
        this.setLoadState(localPath, LoadState.NotLoaded);
        //console.log('UNLOAD ', localPath, ' -> ', val);
      }
    }
    else if (!this.isDataLoaded(localPath)) {
      this.setLoadState(localPath, LoadState.Loaded);
      //console.log('LOAD ', localPath, ' -> ', val);
    }
    else {
      //console.log('NEW DATA ', localPath, ' -> ', val);
    }

    // update cache
    //const oldVal = getDataIn();
    setDataIn(this._cache, localPath, val);

    this._notifyListeners(query);
    //);
    // setTimeout(() => {
    //   for (let i = listeners.length-1; i >= 0; --i) {
    //   for (let i = 0; i < listeners.length; ++i) {
    //     listeners[i](query, val);
    //   }
    // });
  }

  readData(queryInput) {
    const query = this.getQueryByQueryInput(queryInput);
    if (!query) {
      return NOT_LOADED;
    }

    const { localPath } = query;

    const val = getDataIn(this._cache, localPath, NOT_LOADED);

    //console.log('READ [', queryInput, ']', this._loadState[query.localPath], val);

    if (this.isDataFullyAvailable(query)) {
      if (val !== NOT_LOADED) {
        return val;
      }
      else {
        return null;
      }
    }
    else {
      if (val !== NOT_LOADED && val !== null) {
        // TODO: i forgot the use-case for this, but I'm sure it would break something if we removed it
        console.warn('data vailable but not "fully" available:', queryInput, ' - ', val);
        return val;
        //throw new Error('data vailable but not "fully" available - returning null: ' + queryInput + ' - ' + val);
      }
      return NOT_LOADED;
    }
  }

  markPossibleUpdate(queryInput) {
    const query = this.getQueryByQueryInput(queryInput);
    if (query) {
      this._notifyListeners(query);
    }
  }

  _notifyListeners(query) {
    const { localPath } = query;

    // notify all listeners
    let listeners = this.getListeners(localPath);
    console.assert(!listeners || listeners instanceof Set, '[BUG] listeners is not a set at path = ' + localPath);
    listeners = listeners || EmptyArray;

    // listeners will get called once per path
    //setTimeout(() => 

    for (const l of listeners) {
      l(query);
    }
  }

  // #################################################################################################
  // Fetching (async readers)
  // #################################################################################################

  /**
   * Determines whether the current state allows for/needs a fetch
   */
  fetchStart(queryInput) {
    const query = this.getQueryByQueryInput(queryInput);
    //console.warn('R [', queryInput, '] ', query, this._loadState[query.localPath]);
    if (!query) {
      return false;
    }

    const { localPath } = query;
    if (this.getLoadState(localPath) !== LoadState.NotLoaded) {
      return false;
    }

    const fetchFailCount = this._fetchFails[localPath];
    if (fetchFailCount >= fetchMaxFailCount) {
      // past the fail limit
      console.error(`exceeded fetch fail limit @${localPath} - stopped trying.`);
      return false;
    }

    // set load state to fetching
    //  (which is technically still "NotLoaded", but we set state to "Fetching", to prevent double fetching)
    this.setLoadState(localPath, LoadState.Fetching);

    // if failed before, delay!
    if (fetchFailCount > 0) {
      console.warn(`previous fetch failed @${localPath} - throttling`);
      return waitAsync(fetchFailDelay).then(() => true);
    }

    return true;
  }

  /**
   * Update state based on fetched result
   */
  fetchEnd(queryInput, val) {
    const query = this.getQueryByQueryInput(queryInput);
    if (!query) return;

    const {
      localPath,
      remotePath
    } = query;

    if (val === NOT_LOADED) {
      this.fetchFailed(queryInput, 'fetch returned NOT_LOADED');
    }
    else {
      if (this.getLoadState(localPath) !== LoadState.Fetching) {
        // something happened in the meantime -> discard fetched result
        console.warn('discarding fetched result because path status changed @', localPath, '-', val);
        return;
      }

      // reset failure
      this._fetchFails[localPath] = null;

      // update state
      this.setLoadState(localPath, LoadState.Loaded);

      // set new state + notify all listeners
      this.actions.set(remotePath, val);
    }
  }

  fetchFailed(queryInput, err) {
    console.error(`Failed to fetch path "${queryInput}" - `, (err && err.stack || err));

    const query = this.getQueryByQueryInput(queryInput);
    if (!query) return;
    const {
      localPath,
      remotePath
    } = query;

    if (this.getLoadState(localPath) !== LoadState.Fetching) {
      // something happened in the meantime -> discard fetched result
      return;
    }

    // remember failure
    this._fetchFails[localPath] = (this._fetchFails[localPath] || 0) + 1;

    // downgrade load state at path
    this.setLoadState(localPath, LoadState.NotLoaded);
    this.actions.set(remotePath, NOT_LOADED);
  }
  

  // #################################################################################################
  // Any DataProvider can implement the following methods
  // #################################################################################################

  /**
   * Fetch data once, asynchronously, no strings attached.
   */
  async fetchOnce() {
    return NOT_LOADED;
  }

  /**
   * A listener started listening on a path for the first time
   * -> That signals DataProviders to start fetching their data.
   */
  onPathListenStart(query, firstListener) {
    //throw new Error('DataProvider did not implement `onListenerAdd` method');
  }

  /**
   * Not a single soul cares about the localPath in the given query anymore
   */
  onPathListenEnd(query, customData) {
    //throw new Error('DataProvider did not implement `onListenerRemove` method');
  }

  actions = {
    set: (remotePath, val) => {
      throw new Error('DataProvider did not implement `set` action');
    },

    push: (remotePath, val) => {
      throw new Error('DataProvider did not implement `push` action');
    },

    update: (remotePath, val) => {
      throw new Error('DataProvider did not implement `update` action');
    },

    delete: (remotePath) => {
      throw new Error('DataProvider did not implement `delete` action');
    },

    // transaction: () => {
    // },

    // batchUpdate: () => {
    // }
  }
}
