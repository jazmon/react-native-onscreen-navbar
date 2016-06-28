import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';

const propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.node.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 6,
  },
});

function Button({ onPress, children }) {
  /* eslint-disable new-cap */
  return (
    <TouchableNativeFeedback
      delayPressIn={0}
      background={TouchableNativeFeedback.Ripple('#000')}
      onPress={onPress}
    >
      <View style={styles.container}>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
  /* eslint-enable new-cap */
}
Button.propTypes = propTypes;


export default Button;
