// @flow

'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  ColorPropType,
  processColor,
  NativeModules,
} = ReactNative;

const NavigationBarManager = NativeModules.NavigationBarManager;

type DefaultProps = {
  animated: boolean;
};

/**
 * Merges the prop stack with the default values.
 */
function mergePropsStack(propsStack: Array<Object>, defaultValues: Object): Object {
  return propsStack.reduce((prev, cur) => {
    for (let prop in cur) {
      if (cur[prop] != null) {
        prev[prop] = cur[prop];
      }
    }
    return prev;
  }, Object.assign({}, defaultValues));
}

/**
 * Returns an object to insert in the props stack from the props
 * and the transition/animation info.
 */
function createStackEntry(props: any): any {
  return {
    backgroundColor: props.backgroundColor != null ? {
      value: props.backgroundColor,
      animated: props.animated,
    } : null,
    translucent: props.translucent,
    // hidden: props.hidden != null ? {
    //   value: props.hidden,
    animated: props.animated,
    //   transition: props.showHideTransition,
    // } : null,
  };
}

const NavigationBar = React.createClass({
  statics: {
    _propsStack: [],
    _defaultProps: createStackEntry({
      animated: false,
      showHideTransition: 'fade',
      backgroundColor: 'black',
      translucent: false,
      // hidden: false,
    }),
    // Timer for updating the native module values at the end of the frame.
    _updateImmediate: null,
    // The current merged values from the props stack.
    _currentValues: null,

    /**
     * The current height of the status bar on the device.
     *
     * @platform android
     */
    currentHeight: NavigationBarManager.HEIGHT,

    // /**
    //  * Show or hide the status bar
    //  * @param hidden The dialog's title.
    //  * @param animation Optional animation when
    //  *    changing the status bar hidden property.
    //  */
    // setHidden(hidden: boolean, animation?: NavigationBarAnimation) {
    //   animation = animation || 'none';
    //   NavigationBar._defaultProps.hidden.value = hidden;
    //   if (Platform.OS === 'ios') {
    //     NavigationBarManager.setHidden(hidden, animation);
    //   } else if (Platform.OS === 'android') {
    //     NavigationBarManager.setHidden(hidden);
    //   }
    // },

    /**
     * Set the background color for the status bar
     * @param color Background color.
     * @param animated Animate the style change.
     */
    setBackgroundColor(color: string, animated?: boolean) {
      animated = animated || false;
      NavigationBar._defaultProps.backgroundColor.value = color;
      NavigationBarManager.setColor(processColor(color), animated);
    },

    /**
     * Control the translucency of the status bar
     * @param translucent Set as translucent.
     */
    setTranslucent(translucent: boolean) {
      NavigationBar._defaultProps.translucent = translucent;
      NavigationBarManager.setTranslucent(translucent);
    },
  },

  propTypes: {
    // /**
    //  * If the status bar is hidden.
    //  */
    // hidden: React.PropTypes.bool,
    /**
     * If the transition between status bar property changes should be animated.
     * Supported for backgroundColor, barStyle and hidden.
     */
    animated: React.PropTypes.bool,
    /**
     * The background color of the status bar.
     * @platform android
     */
    backgroundColor: ColorPropType,
    /**
     * If the status bar is translucent.
     * When translucent is set to true, the app will draw under the status bar.
     * This is useful when using a semi transparent status bar color.
     *
     * @platform android
     */
    translucent: React.PropTypes.bool,
  },

  getDefaultProps(): DefaultProps {
    return {
      animated: false,
      showHideTransition: 'fade',
    };
  },

  _stackEntry: null,

  componentDidMount() {
    // Every time a NavigationBar component is mounted, we push it's prop to a stack
    // and always update the native status bar with the props from the top of then
    // stack. This allows having multiple NavigationBar components and the one that is
    // added last or is deeper in the view hierachy will have priority.
    this._stackEntry = createStackEntry(this.props);
    NavigationBar._propsStack.push(this._stackEntry);
    this._updatePropsStack();
  },

  componentWillUnmount() {
    // When a NavigationBar is unmounted, remove itself from the stack and update
    // the native bar with the next props.
    const index = NavigationBar._propsStack.indexOf(this._stackEntry);
    NavigationBar._propsStack.splice(index, 1);

    this._updatePropsStack();
  },

  componentDidUpdate() {
    const index = NavigationBar._propsStack.indexOf(this._stackEntry);
    this._stackEntry = createStackEntry(this.props);
    NavigationBar._propsStack[index] = this._stackEntry;

    this._updatePropsStack();
  },

  /**
   * Updates the native status bar with the props from the stack.
   */
  _updatePropsStack() {
    // Send the update to the native module only once at the end of the frame.
    clearImmediate(NavigationBar._updateImmediate);
    NavigationBar._updateImmediate = setImmediate(() => {
      const oldProps = NavigationBar._currentValues;
      const mergedProps = mergePropsStack(NavigationBar._propsStack, NavigationBar._defaultProps);

      // Update the props that have changed using the merged values from the props stack.
      if (!oldProps || oldProps.backgroundColor.value !== mergedProps.backgroundColor.value) {
        NavigationBarManager.setColor(
          processColor(mergedProps.backgroundColor.value),
          mergedProps.backgroundColor.animated,
        );
      }
      // if (!oldProps || oldProps.hidden.value !== mergedProps.hidden.value) {
      //   NavigationBarManager.setHidden(mergedProps.hidden.value);
      // }
      if (!oldProps || oldProps.translucent !== mergedProps.translucent) {
        NavigationBarManager.setTranslucent(mergedProps.translucent);
      }
      // Update the current prop values.
      NavigationBar._currentValues = mergedProps;
    });
  },

  render(): ?ReactElement<any> {
    return null;
  },
});

module.exports = NavigationBar;
