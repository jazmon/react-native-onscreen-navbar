// @flow
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';

import NavigationBar from 'react-native-onscreen-navbar';
import Button from './src/components/Button';

function getRandomInteger(min, max) {
  return Math.floor((Math.random() * max) % max) + min;
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

  changeColor = () => {
    this.setState({
      color: ExampleProject.colors[getRandomInteger(0, ExampleProject.colors.length)],
      translucent: false,
    });
  };

  toggleTranslucent = () => {
    this.setState({
      translucent: !this.state.translucent,
    });
  }

  render() {
    return (
      <View
        style={[styles.container, {
          width: Dimensions.get('window').width,
          paddingBottom: this.state.translucent ? NavigationBar.currentHeight : 0,
          paddingTop: this.state.translucent ? StatusBar.currentHeight : 0,
          height: Dimensions.get('window').height + (this.state.translucent
            ? (StatusBar.currentHeight + NavigationBar.currentHeight)
            : 0),
        }]}
      >
        <StatusBar
          animated={true}
          translucent={this.state.translucent}
          backgroundColor={this.state.translucent ? 'rgba(0, 0, 0, 0.5)' : this.state.color}
        />
        <NavigationBar
          animated={true}
          translucent={this.state.translucent}
          backgroundColor={this.state.color}
        />

        <View style={styles.contentWrapper}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Play around with the settings!
            </Text>
            <Text>StatusBar height: {StatusBar.currentHeight}</Text>
            <Text>NavigationBar height: {NavigationBar.currentHeight}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.changeColor}>
              <Text style={styles.buttonText}>Change color!</Text>
            </Button>
            <Button onPress={this.toggleTranslucent}>
              <Text style={styles.buttonText}>Set translucent!</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#403eb4',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonText: {
    color: '#000',
  },
});

AppRegistry.registerComponent('ExampleProject', () => ExampleProject);
