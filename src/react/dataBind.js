import DataAccessTracker from '../DataAccessTracker';
import { sharedArgumentProxyProperties } from '../ProxyUtil';

import partialRight from 'lodash/partialRight';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import toString from 'lodash/toString';

import fpGroupBy from 'lodash/fp/groupBy';
import fpMap from 'lodash/fp/map';
import fpMapValues from 'lodash/fp/mapValues';
import fpToPairs from 'lodash/fp/toPairs';
import fpZipObject from 'lodash/fp/zipObject';
import flow from 'lodash/fp/flow';


import { EmptyObject, EmptyArray } from 'src/util';

import autoBind from 'src/util/auto-bind';

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import {
  dataBindContextStructure,
  dataBindChildContextStructure,
  getDataSourceTreeFromReactContext,
  getCustomContextFromReactContext,
  buildReactContextForDataBind
} from './lib/dbdi-react-internals';

//import { injectRenderArgs } from './react-util';

export { NOT_LOADED } from '../dataProviders/DataProviderBase';

// class ReactContextDataProvider extends DataProviderBase {
//   // TODO: a data provider to read/write the local React context without it's usual shortcomings
//   // TODO: proper pub-sub bindings
// }

/**
 * Build + wrap render method of component class
 */
function initStatefulComponent(Comp, injectedArgs) {
  const origRender = Comp.prototype.render;
  Comp.prototype.render = function render_dataBind(...origArgs) {
    // NOTE: render does not have arguments, but some other wrapper might have injected `origArgs`, so we just add them into the circus
    //console.log('wrapped render: ' + props.name + `(${JSON.stringify(origArgs)}) → (${JSON.stringify(newArgs)})`);
    return origRender.call(this, ...injectedArgs, ...origArgs);
  };

  return function render() {
    const { WrappedComponent } = this;

    return (<WrappedComponent
      {...this.props}
      {...this._customProps}
      {...this._customFunctions}
    />);
  };
}

/**
 * Build + wrap render method of functional component
 */
function initFunctionalComponent(Comp, injectedArgs) {
  function Wrapper(...origArgs) {
    // NOTE: origArgs should be [props, context] in React 16
    //console.log('wrapped render: ' + `(${JSON.stringify(origArgs)}), (${JSON.stringify(injectedArgs)})`);
    return Comp.call(this, ...injectedArgs, ...origArgs);
  }

  Object.defineProperty(Wrapper, 'name', { value: Comp.name + '_dataBind' });

  return Wrapper;
}


/**
 * dataBind
 */
export default (propsOrPropCb) => _WrappedComponent => {
  class DataBindComponent extends Component {
    static contextTypes = dataBindContextStructure;
    static childContextTypes = dataBindChildContextStructure;
    static propTypes = {
      setContext: PropTypes.object
    };

    _dataSourceTree;
    _dataAccessTracker;

    /**
     * The dataProxy first checks for props, then for context, and if nothing is provided,
     * it executes any pre-configured dataRead node of given name and returns their value.
     * When data is attempted to be read, its path is added as a dependency, 
     * and loading initialized if it has not initialized before.
     */
    _variableProxy;

    /**
     * Provides read and write executer functions, as well as special functions as defined in
     * below _buildFunctionProxy.
     */
    _functionProxy;

    // more data injection stuff
    _customContext;
    _customProps = {};
    _customFunctions = {};

    // bookkeeping ((currently) mostly unused)
    _isMounted;
    _alreadyRefreshing;

    constructor(props, context) {
      super(props, context);

      autoBind(this);

      this._isMounted = false;

      // prepare access tracker
      this._dataSourceTree = getDataSourceTreeFromReactContext(context);
      this._dataAccessTracker = this._dataSourceTree.newAccessTracker(
        _WrappedComponent.name || '<unnamed component>',
        this._onNewData
      );

      // get context data
      this._customContext = Object.assign({}, getCustomContextFromReactContext(context) || {});


      // prepare all the stuff
      this._buildCustomFunctions();
      this._buildVariableProxy();
      this._buildFunctionProxy();

      // finally, engulf the new component with our custom arguments
      this._injectedArguments = [
        this._variableProxy,
        this._functionProxy,

        // Note: the inject proxy only injects from confirmed readers.
        //  Custom funcs cannot currently be used for injection.
        this._dataAccessTracker._injectProxy
      ];

      // const Wrapper = (...allArgs) => {
      //   const props = allArgs[allArgs.length-3];
      //   console.log(allArgs.length, ...allArgs);
      //   return (<WrappedComponent {...props} />);
      // };

      // // TODO: we can merge injection into the render() call below!?!?
      // this.WrappedComponent = injectRenderArgs(
      //   WrappedComponent,
      //   this._injectedArguments
      // );
      // there is no good working heuristic to figure out if it's a function representing a component :(
      //const isStatefulComponent = _WrappedComponent && _WrappedComponent.prototype instanceof Component;
      const isStatefulComponent = _WrappedComponent && _WrappedComponent.prototype instanceof Component;
      const isComponentFunction = this.isFunctionalComponent = isFunction(_WrappedComponent);

      if (!isComponentFunction && !isStatefulComponent) {
        throw new Error('Tried to decorate object that is neither pure function nor component: ' + _WrappedComponent);
      }

      // decorate the component
      let render;
      
      if (isStatefulComponent) {
        // create new class for every instance of this component
        class __WrappedComponent extends _WrappedComponent { };
        Object.defineProperty(__WrappedComponent, 'name', {
          value: _WrappedComponent.name + '_dataBind'
        });
        this.WrappedComponent = __WrappedComponent;

        // inject custom methods into stateful component
        Object.assign(this.WrappedComponent.prototype,
          this._buildCustomMethods()
        );
        render = initStatefulComponent(this.WrappedComponent, this._injectedArguments);
      }
      else {
        this.WrappedComponent = _WrappedComponent;
        render = initFunctionalComponent(this.WrappedComponent, this._injectedArguments);
      }

      this.render = render;
    }


    // ################################################
    // Initialization
    // ################################################

    /**
     * These methods are added to the prototype of the wrapped component
     */
    _buildCustomMethods() {
      const { _injectedArguments } = this;
      return {
        dataBindMethod(methodOrName) {
          if (!methodOrName) {
            throw new Error('invalid argument in dataBindMethod: null or undefined');
          }
          const methodName = isString(methodOrName) ?
            methodOrName :
            methodOrName.name;

          if (!methodName || !isFunction(this[methodName])) {
            throw new Error('Could not resolve method when adding data bindings: ' +
              methodOrName + ' - ' + methodName + ' - ' + this[methodName]);
          }

          //const origMethod = this[methodName];

          // hack: we must override the prototype because else react-autobind won't catch it
          // NOTE: it's oke because we created a new class in constructor anyway
          //    (injectRenderArgs returns a new class)
          //const proto = Object.getPrototypeOf(this);
          return this[methodName] = partialRight(
            this[methodName],
            ..._injectedArguments
          );
          // (...ownArgs) => {
          //   return origMethod(...ownArgs, ..._injectedArguments);
          // };
        },

        dataBindMethods(...methodOrNames) {
          return map(methodOrNames, (methodOrName, i) => {
            if (!methodOrName) {
              throw new Error(
                `invalid argument #${i} in dataBindMethod(s): null or undefined`);
            }
            return this.dataBindMethod(methodOrName);
          });
        }
      };
    }

    /**
     * Set of custom functions/special functions that serve as utility
     * to better integrate the data model with React.
     */
    _buildCustomFunctions() {
      this._customFunctions = {
        /**
         * Add context contents.
         * 
         * TODO: This is really bad. 
         *    Need to provide a pub-sub solution using a custom DataProvider instead.
         */
        setContext: (newContext) => {
          Object.assign(this._customContext, newContext);
          throw new Error('This is not properly supported yet, since shouldComponentUpdate does not account for context yet');
        },

        getProps: () => {
          return this.props;
        }
      };
    }

    /**
     * Build the proxy to deliver props, context and custom data.
     */
    _buildVariableProxy() {
      // TODO: make this spreadable!
      // TODO: implement ownKeys (and possibly enumerate) in handler
      // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

      const enumerableProps = () => {
        //return Object.assign({}, Object.keys(this.props || EmptyObject), Object.keys(this._customProps || EmptyObject));
        return [...Object.keys(this.props || EmptyObject), ...Object.keys(this._customProps || EmptyObject)];
      };
      const defaultPropDesc = {
        enumerable: true,
        configurable: true,
      };
      const specialProps = {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
         */
        [Symbol.iterator]: (target) => {
          const p1 = this.props;
          const p2 = this._customProps;
          return function* () {
            for (let p in p1) {
              yield p1[p];
            }
            for (let p in p2) {
              yield p2[p];
            }
          };
        }
      };
      this._variableProxy = new Proxy({}, {
        get: (target, name) => {
          // 0) check special stuff
          if (specialProps[name]) {
            return specialProps[name](target);
          }

          // 1) check custom data
          if (name in this._customProps) {
            return this._customProps[name];
          }

          // 2) check props
          if (name in this.props) {
            return this.props[name];
          }

          // // 3) check context
          // if (name in this.context) {
          //   return this.context[name];
          // }

          // // 4) check custom context
          // if (name in this._customContext) {
          //   //console.warn('get from customContext: ' + name);
          //   return this._customContext[name];
          // }

          // 5) check special properties
          if (name in sharedArgumentProxyProperties) {
            return sharedArgumentProxyProperties[name];
          }

          // TODO: move this somewhere else or get rid of it entirely
          // // 4) check for direct data inject
          // const readData = this._dataAccessTracker.resolveReadData(name);
          // if (readData) {
          //   return readData();
          // }

          //if (this._isMounted) 
          {
            //console.error(
            debugger;
            throw new Error(
              `DI failed - Component requested props/context "${toString(name)}" but was not provided`
            );
            //.stack);
          }
          return undefined;
        },

        has: (target, name) => {
          // 1) check custom data
          if (name in this._customProps) {
            return true;
          }

          // 2) check props
          if (name in this.props) {
            return true;
          }

          // // 3) check context
          // if (name in this.context) {
          //   return true;
          // }

          // // 4) check custom context
          // if (name in this._customContext) {
          //   return true;
          // }

          // 5) check special properties
          if (name in sharedArgumentProxyProperties) {
            return true;
          }

          return false;
        },

        enumerate(target) {
          return enumerableProps();
        },

        getOwnPropertyDescriptor() {
          return defaultPropDesc;
        },

        ownKeys(target) {
          return enumerableProps();
        }
      });
    }

    /**
     * Build the proxy to inject actions + selections
     */
    _buildFunctionProxy() {
      this._functionProxy = new Proxy({}, {
        get: (target, name) => {

          // 1) check custom actions
          const customFunction = this._customFunctions[name];
          if (customFunction) {
            return customFunction;
          }

          // 2) check readers
          const readData = this._dataAccessTracker.resolveReadData(name);
          if (readData) {
            return readData;
          }

          // 3) check writers
          const writeData = this._dataAccessTracker.resolveWriteData(name);
          if (writeData) {
            return writeData;
          }

          //if (this._isMounted) 
          {
            //console.error(
            throw new Error(
              `DI failed - Component requested function "${toString(name)}" but was not provided.`
            );
            //.stack);
          }
          return null;
        },

        has: (target, name) => {
          // 1) check custom actions
          const customFunction = this._customFunctions[name];
          if (customFunction) {
            return true;
          }

          // 2) check readers
          const readData = this._dataAccessTracker.resolveReadData(name);
          if (readData) {
            return true;
          }

          // 3) check writers
          const writeData = this._dataAccessTracker.resolveWriteData(name);
          if (writeData) {
            return true;
          }

          return false;
        },

        enumerate() {
          throw new Error('[NYI] cannot enumerate "Function" proxy (yet)');
        },

        ownKeys() {
          throw new Error('[NYI] cannot enumerate "Function" proxy (yet)');
        }
      });
    }

    _wrapCustomData(data) {
      return data;
    }

    _wrapCustomFunctions(f) {
      // inject proxies as initial arguments
      return partialRight(f, ...this._injectedArguments);
    }

    _wrapCustomFunctionsAndData = flow(
      fpToPairs,
      fpGroupBy(item => isFunction(item[1]) ? 'functions' : 'data'),
      fpMapValues(items =>
        fpZipObject(fpMap(item => item[0])(items))(fpMap(item => item[1])(items))
      ),
      (items) => ({
        data: mapValues(items.data, this._wrapCustomData),
        functions: mapValues(items.functions, this._wrapCustomFunctions)
      })
    )

    _prepareInjectedProps() {

      // TODO: use caching, so we don't create new wrapper objects every time

      if (propsOrPropCb) {
        // prepare _customProps object
        let props = propsOrPropCb;
        if (isFunction(propsOrPropCb)) {
          props = propsOrPropCb(...this._injectedArguments);
        }
        else if (!isEmpty(this._customProps)) {
          // already done, don't do it again!
          return;
        }

        if (props && !isPlainObject(props)) {
          throw new Error('Invalid props returned from dataBind callback - return value must be plain object: ' +
            this.wrappedComponentName);
        }

        // group props into custom props (data) and custom functions
        const {
          functions,
          data
        } = this._wrapCustomFunctionsAndData(props);

        // assign
        this._customProps = data || EmptyObject;
        Object.assign(this._customFunctions, functions);
      }
    }

    // ################################################
    // Misc private methods
    // ################################################

    _setIsRendering(isRendering) {
      this._isRendering = isRendering;
    }

    // ################################################
    // Public methods + properties
    // ################################################

    get wrappedComponentName() {
      return _WrappedComponent.name ||
        '<unnamed component>';
    }

    getChildContext() {
      return buildReactContextForDataBind(this.context, this._customContext);
    }

    UNSAFE_componentWillUpdate() {
      this._prepareInjectedProps();
    }

    shouldComponentUpdate(nextProps, nextState) {
      // TODO: fix context handling (https://github.com/facebook/react/issues/2517)

      //return this.shouldUpdate;
      // const should = !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);

      // if (!should) {
      //   window.updateCount = (window.updateCount || 0) + 1;
      // }
      return true;
    }

    UNSAFE_componentWillMount() {
      //console.log('dataBind.componentWillMount');

      const newContext = this.props.setContext;
      if (newContext) {
        this._customFunctions.setContext(newContext);
      }

      this._prepareInjectedProps();
      this.forceUpdate();
    }

    componentDidMount() {
      //console.log('dataBind.componentDidMount');
      this._alreadyRefreshing = false;
      this._isMounted = true;
    }

    componentWillUnmount() {
      //console.warn('componentWillUnmount @', this.wrappedComponentName);
      this._isMounted = false;
      this._dataAccessTracker.unmount();

      this._customChildContext = {}; // reset context
    }

    _onNewData(query) {
      // const {
      //   localPath,
      //   queryInput
      // } = query;

      //console.warn(WrappedComponent.name || '<unnamed component>', 'onNewData', localPath, val);
      //this.forceUpdate();
      if (!this._alreadyRefreshing && this._isMounted) {
        //if (!this._isRendering) {
        this._alreadyRefreshing = true;
        setTimeout(() => {
          this._alreadyRefreshing = false;
          if (this._isMounted) {
            //console.warn('setState @', this.wrappedComponentName);
            this.setState(EmptyObject);
          }
        });
      }
      // else {
      //   // new data could be triggered by render method → make sure, that that is taken care of
      //   throw new Error('NYI: state updates during render');
      //   // setTimeout(() => {
      //   //   this.setState({});
      //   // });
      // }
    }
  }

  // override class name (miraculously, it works equally for functional and stateful components!)
  // see https://stackoverflow.com/questions/33605775/es6-dynamic-class-names/46132163#46132163
  Object.defineProperty(DataBindComponent, 'name', {
    value: _WrappedComponent.name + '_dataBind'
  });

  return DataBindComponent;
};