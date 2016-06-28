import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  StatusBar,
} from 'react-native';

import NavigationBar from 'react-native-onscreen-navbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403eb4',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
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
      <View
        style={{
          backgroundColor: '#fff',
          padding: 6,
        }}
      >
        {children}
      </View>
    </TouchableNativeFeedback>
  );
  /* eslint-enable new-cap */
}

Button.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.node.isRequired,
};

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * max % max) + min;
}

class ExampleProject extends Component {
  static colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#000000',
  ];

  constructor() {
    super();

    this.state = {
      color: ExampleProject.colors[getRandomInteger(0, ExampleProject.colors.length)],
      translucent: false,
    };
  }

  componentWillMount() {
    NavigationBar.setColor(this.state.color);
  }

  changeColor = () => {
    if (this.state.translucent) {
      this.setState({
        translucent: false,
      });
      NavigationBar.setTranslucent(false);
    }

    this.setState({
      color: ExampleProject.colors[getRandomInteger(0, ExampleProject.colors.length)],
    });
    NavigationBar.setColor(this.state.color);
  };

  toggleTranslucent = () => {
    this.setState({
      translucent: !this.state.translucent,
    });
    NavigationBar.setTranslucent(this.state.translucent);
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={false}
          backgroundColor={this.state.color}
        />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.welcome}>
            Play around with the settings!
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
          <Button onPress={this.changeColor}>
            <Text style={{ color: '#000' }}>Change color!</Text>
          </Button>
          <Button onPress={this.toggleTranslucent}>
            <Text style={{ color: '#000' }}>Set translucent!</Text>
          </Button>
        </View>
      </View>
    );
  }
}


AppRegistry.registerComponent('ExampleProject', () => ExampleProject);
