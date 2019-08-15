import React from "react";
import {
  Animated,
  Easing,
  Vibration,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";

// set the timer options to sections by multiplying by milisecons
const TEN_SECONDS = 1000 * 10;
const FIFTEEN_SECONDS = 1000 * 15;
const THIRTY_SECONDS = 1000 * 30;

// whatever device (ios, tablet, android) that is the screenwidth
const {width: screenWidth} = Dimensions.get("window");

// set the inital annimated values to zero for all timer options
const animatedValues = {
  "10": new Animated.Value(0),
  "15": new Animated.Value(0),
  "30": new Animated.Value(0)
};

// create the core component (this is a 1 component app)
export default class App extends React.Component {
  // start the state of the time to undefined
  state = {
    time: undefined
  };

  // this lifecycle should be updated. it was depricated in React 16, I just never got around to updating it.
  // takes 2 values, nextprops and nextState
  // clearInterval clears the interval which has been set by setInterval()
  // setInterval take 2 parameters, a function and a time

  componentWillUpdate = (nextProps, nextState) => {
    clearInterval(this.interval);
    this.stopAnimation();
    // if the next state of time is not equal to undefined...
    // then start the animation,
    // set the interval to the new state timer and vibrate at the same time
    if (nextState.time && nextState.time !== this.state.time) {
      // !== not equal
      this.pauseAnimations = false;
      this.interval = setInterval(() => Vibration.vibrate(), nextState.time);
      this.runAnimation(nextState.time);
    }
  };

  // start the animation
  runAnimation = time => {
    // if it's paused, return early so the animation is not running
    if (this.pauseAnimations) return;

    // 10, 15 or 30
    this.animationId = `${time / 1000}`;

    const animatedValue = animatedValues[this.animationId];
    animatedValue.setValue(0);

    // animate over time
    Animated.timing(animatedValue, {
      toValue: 1, // animate to the value of 1
      duration: time, // how long it will take
      easing: Easing.linear // motion of the animation
      // set when the animation starts
    }).start(() => {
      // called when the animation finished
      this.runAnimation(time);
    });
  };

  //stop animation
  stopAnimation = () => {
    this.pauseAnimations = true; // stopping the animation when it's set to true
    const animatedValue = animatedValues[this.animationId]; // set it to 10, 15 or 30

    if (animatedValue) {
      animatedValue.stopAnimation(); // react native method that stop the animation
      animatedValue.setValue(0); // animation value is zero
    }
  };

  // clean up - stop everything
  componentWillUnmount = () => {
    this.stopAnimation();
    this.stopInterval();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(TEN_SECONDS)}>
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === TEN_SECONDS && {
                // interpolation maps input ranges to output ranges, typically using a linear interpolation but also supports easing functions
                width: animatedValues["10"].interpolate({
                  inputRange: [0, 1], // start to finish
                  outputRange: [0, screenWidth] // start to end of the screenwidth
                })
              }
            ]}
          />
          <Text style={styles.buttonText}>10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(FIFTEEN_SECONDS)}>
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === FIFTEEN_SECONDS && {
                width: animatedValues["15"].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth]
                })
              }
            ]}
          />
          <Text style={styles.buttonText}>15</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.setTime(THIRTY_SECONDS)}>
          <Animated.View
            style={[
              styles.buttonBackground,
              this.state.time === THIRTY_SECONDS && {
                width: animatedValues["30"].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screenWidth]
                })
              }
            ]}
          />
          <Text style={styles.buttonText}>30</Text>
        </TouchableOpacity>
      </View>
    );
  }
  setTime = time => () =>
    this.setState(prevState => ({
      time: prevState.time === time ? undefined : time
    }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "space-between"
  },
  buttonBackground: {
    backgroundColor: "pink",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0
  },
  buttonText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
