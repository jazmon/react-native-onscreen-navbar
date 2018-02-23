// @flow
import React from 'react';

function noop() {}

class NavigationBar extends React.PureComponent<{}> {
  static currentHeight: 0;
  static setBackgroundColor = noop;
  static setTranslucent = noop;
  render() {
    return null;
  }
}

export default NavigationBar;
