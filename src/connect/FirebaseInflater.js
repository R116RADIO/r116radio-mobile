// @flow

import * as firebase from 'firebase';

class FirebaseInflater {
  static instance;

  static __initializeIfNeeded(props: Props) {
    if (FirebaseInflater.instance) {
      return;
    }

    this.instance = firebase.initializeApp(props.config);
  }

  static initialize(props: Props) {
    this.__initializeIfNeeded(props);
  }

  static getInstance(): Feathers {
    return FirebaseInflater.instance;
  }
}

export default FirebaseInflater;
