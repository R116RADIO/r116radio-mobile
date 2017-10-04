import { Component, createElement } from 'react';
import contextShape from './utils/contextShape';
import shallowEqual from './utils/shallowEqual';
import invariant from 'invariant';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function connectFirebase(options = {}) {
  const { pure = true, withRef = false } = options;
  return WrappedComponent => class FirebaseConnector extends Component {
    static propTypes = {
      firebaseDatabase: contextShape,
      firebaseStorage: contextShape,
    };

    static contextTypes = {
      firebaseDatabase: contextShape,
      firebaseStorage: contextShape,
    };

    constructor(props, context) {
      super(props, context);
      this.firebaseDatabase = props.firebaseDatabase || context.firebaseDatabase;
      this.firebaseStorage = props.firebaseStorage || context.firebaseStorage;

      this.haveOwnPropsChanged = false;
      this.state = {};

      const displayName = `Firebase(${getDisplayName(WrappedComponent)})`;

      invariant(this.firebaseDatabase && this.firebaseStorage,
        'Could not find "firebaseDatabase" and "firebaseStorage" in either the context or ' +
        `props of "${displayName}". ` +
        'Either wrap the root component in a <FirebaseWrapper>, ' +
        'or explicitly pass "firebaseDatabase" and "firebaseStorage" as a prop to "${displayName}".'
      );
    }

    componentWillReceiveProps(nextProps) {
      if (!pure || !shallowEqual(nextProps, this.props)) {
        this.haveOwnPropsChanged = true;
      }
    }

    shouldComponentUpdate() {
      return !pure || this.haveOwnPropsChanged;
    }

    getWrappedInstance() {
      invariant(withRef,
        'To access the wrapped instance, you need to specify ' +
        '{ withRef: true } as the fourth argument of the connect() call.'
      );

      return this._ref;
    }


    render() {
      const finalProps = {
        firebaseDatabase: this.firebaseDatabase,
        firebaseStorage: this.firebaseStorage,
        ...this.state,
        ...this.props
      };

      if (withRef) {
        this.renderedElement = createElement(WrappedComponent, {
          ...finalProps,
          ref: (ref) => (this._ref = ref)
        });
      } else {
        this.renderedElement = createElement(WrappedComponent, {
          ...finalProps,
        });
      }

      return this.renderedElement;
    }
  };
}
