// @flow
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Button,
} from 'react-native';

import NavigationBar from 'react-native-onscreen-navbar';

const colors = [
  '#f44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
];

type State = {
  color: number;
  translucent: boolean;
};

class ExampleProject extends Component {
  constructor() {
    super();

    this.state = {
      color: 0,
      translucent: false,
    };
  }

  state: State;

  changeColor = (): void => {
    let currentColor: number = this.state.color;
    const color: number = this.state.color >= colors.length ? 0 : currentColor += 1;
    this.setState({
      color,
      translucent: false,
    });
  };

  toggleTranslucent = (): void => {
    this.setState({
      translucent: !this.state.translucent,
    });
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const { translucent, color } = this.state;
    const backgroundColor: string = colors[color];
    return (
      <View
        style={[styles.container, {
          width,
          paddingBottom: this.state.translucent ? NavigationBar.currentHeight : 0,
          paddingTop: this.state.translucent ? StatusBar.currentHeight : 0,
          height: height + (this.state.translucent
            ? (StatusBar.currentHeight + NavigationBar.currentHeight)
            : 0),
        }]}
      >
        <StatusBar
          animated={true}
          translucent={translucent}
          backgroundColor={translucent ? 'rgba(0, 0, 0, 0.5)' : backgroundColor}
        />
        <NavigationBar
          animated={true}
          translucent={translucent}
          backgroundColor={backgroundColor}
        />
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Play around with the settings!
            </Text>
            <Text style={styles.secondaryText}>
              StatusBar height: {StatusBar.currentHeight}
            </Text>
            <Text style={styles.secondaryText}>
              NavigationBar height: {NavigationBar.currentHeight}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Change color!"
              onPress={this.changeColor}
            />
            <Button
              title="Set translucent!"
              onPress={this.toggleTranslucent}
            />
          </View>
        </View>
      </View>
    );
  }
}

type Styles = {[key: string]: Object};

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    marginVertical: 10,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  secondaryText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

AppRegistry.registerComponent('ExampleProject', () => ExampleProject);
