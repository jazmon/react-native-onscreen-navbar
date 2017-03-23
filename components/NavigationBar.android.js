// @flow
// Implementation borrows heavily from https://github.com/facebook/react-native/blob/master/Libraries/Components/StatusBar/StatusBar.js
import React from 'react';
import {
  ColorPropType,
  processColor,
  NativeModules,
} from 'react-native';

const NavigationBarManager = NativeModules.NavigationBarManager;

/**
 * Merges the prop stack with the default values.
 */
function mergePropsStack(
  propsStack: Array<StackEntry>, defaultValues: StackEntry
): StackEntry {
  return propsStack.reduce((prev, cur) =>
    ({ ...prev, ...cur }), { ...defaultValues });
}

type StackEntry = {
  backgroundColor: {
    value: string;
    animated: boolean;
  };
  translucent: boolean;
  animated: boolean;
};

/**
 * Returns an object to insert in the props stack from the props
 * and the transition/animation info.
 */
const createStackEntry = (props: Props): StackEntry => ({
  backgroundColor: {
    value: props.backgroundColor,
    animated: props.animated,
  },
  translucent: props.translucent,
  animated: props.animated,
});

/* eslint-disable react/no-unused-prop-types */
type Props = {
  animated: boolean;
  backgroundColor: string;
  translucent: boolean;
};
/* eslint-enable react/no-unused-prop-types */


type DefaultPropsType = {
  animated: boolean;
  translucent: boolean;
  backgroundColor: string;
};

class NavigationBar extends React.Component {
  static propTypes = {
    /**
     * If the transition between navigation bar property changes should be animated.
     * Supported for backgroundColor.
     */
    animated: React.PropTypes.bool,
    /**
     * The background color of the navigation bar.
     */
    backgroundColor: ColorPropType,
    /**
     * If the navigation bar is translucent.
     * When translucent is set to true, the app will draw under the navigation bar.
     * This is useful when using a semi transparent navigation bar color.
     */
    translucent: React.PropTypes.bool,
  };

  static defaultProps: DefaultPropsType = {
    animated: false,
    translucent: false,
    backgroundColor: '#000000',
  }

  static propsStack: Array<StackEntry> = [];
  static updateImmediate: ?Object = null;
  static currentValues: ?StackEntry = null;

  /**
   * The current height of the status bar on the device.
   *
   */
  static currentHeight: number = NavigationBarManager.HEIGHT;

  /**
   * Set the background color for the status bar
   * @param color Background color.
   * @param animated Animate the style change.
   */
  static setBackgroundColor(color: string, animated?: boolean = false) {
    if (NavigationBar.defaultProps.backgroundColor) {
      NavigationBar.defaultProps.backgroundColor.value = color;
      NavigationBar.defaultProps.backgroundColor.animated = animated;
    }
    NavigationBarManager.setColor(processColor(color), animated);
  }

  /**
   * Control the translucency of the status bar
   * @param translucent Set as translucent.
   */
  static setTranslucent(translucent: boolean) {
    NavigationBar.defaultProps.translucent = translucent;
    NavigationBarManager.setTranslucent(translucent);
  }

  stackEntry: StackEntry;
  props: Props;

  static defaultProps: StackEntry = createStackEntry({
    animated: false,
    backgroundColor: '#000000',
    translucent: false,
  });

  componentDidMount() {
    // add this instance's props to the stack
    this.stackEntry = createStackEntry(this.props);
    NavigationBar.propsStack.push(this.stackEntry);
    this.updatePropsStack();
  }

  componentDidUpdate() {
    // modify this instance's props in the stack
    const index: number = NavigationBar.propsStack.indexOf(this.stackEntry);
    this.stackEntry = createStackEntry(this.props);
    NavigationBar.propsStack[index] = this.stackEntry;

    this.updatePropsStack();
  }

  componentWillUnmount() {
    // remove this instance's props from the stack
    const index: number = NavigationBar.propsStack.indexOf(this.stackEntry);
    NavigationBar.propsStack.splice(index, 1);

    this.updatePropsStack();
  }

  updatePropsStack = () => {
    clearImmediate(NavigationBar.updateImmediate);
    NavigationBar.updateImmediate = setImmediate(() => {
      const oldProps: ?StackEntry = NavigationBar.currentValues;
      const mergedProps: StackEntry =
        mergePropsStack(NavigationBar.propsStack, NavigationBar.defaultProps);

      if (!oldProps || oldProps.backgroundColor.value !== mergedProps.backgroundColor.value) {
        NavigationBarManager.setColor(
          processColor(mergedProps.backgroundColor.value),
          mergedProps.backgroundColor.animated,
        );
      }
      if (!oldProps || oldProps.translucent !== mergedProps.translucent) {
        NavigationBarManager.setTranslucent(mergedProps.translucent);
      }
      NavigationBar.currentValues = mergedProps;
    });
  }

  render() {
    return null;
  }
}

export default NavigationBar;
