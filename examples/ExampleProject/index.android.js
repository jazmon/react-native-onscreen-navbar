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

const colors: Array<string> = [
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

function getColor(array: Array<string>, currentIndex: number = 0) {
  let index: number = currentIndex;
  index = index >= array.length - 1 ? 0 : index += 1;
  return index;
}

type State = {
  color: number;
  translucent: boolean;
  animating: boolean;
};

class ExampleProject extends Component {
  interval: ?number;

  constructor() {
    super();

    this.state = {
      color: getColor(colors),
      translucent: false,
      animating: false,
    };

    this.interval = null;
  }

  state: State;

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  changeColor = (): void => {
    const color: number = getColor(colors, this.state.color);
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

  toggleAnimating = (): void => {
    const animate: boolean = !this.state.animating;

    if (!animate && this.interval) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(() => {
        this.setState({
          color: getColor(colors, this.state.color),
        });
      }, 300);
    }

    this.setState({
      animating: animate,
    });
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const { translucent, color, animating } = this.state;
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
              Example Project for{'\n'}
              <Text style={styles.emphasis}>react-native-onscreen-navbar</Text>
              {'\n'}Play around with the settings!
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
              title={animating ? 'Stop animating' : 'Start animating'}
              onPress={this.toggleAnimating}
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
    marginVertical: 24,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    marginVertical: 10,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  emphasis: {
    fontWeight: 'normal',
    fontFamily: 'sans-serif-mono',
    backgroundColor: 'rgba(121, 121, 121, 0.10)',
    lineHeight: 28,
  },
  secondaryText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  buttonContainer: {
    flex: 0.5,
    marginVertical: 24,
    marginBottom: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

AppRegistry.registerComponent('ExampleProject', () => ExampleProject);
