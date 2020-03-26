import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import Tiziano from './assets/0.jpeg'
import {useMemoOne} from 'use-memo-one'
import Animated from 'react-native-reanimated'

const {Value, useCode, Clock, set, startClock, interpolate, Extrapolate, add, block, cond, eq} = Animated
const duration = 2000

export default function App() {

  const [show, setShow] = useState(true);
  //usememo is used in order not to reinitialise these values for each render
  const { from, to, clock, progress } = useMemoOne(
    () => ({
      clock: new Clock(),
      progress: new Value(0),
      from: new Value(0),
      to: new Value(0)
    }),
    []
  );
  // const clock = new Clock()
  // const time = new Value(0)
  // value for the progress of the animation
  // goes from 0 to 1
  // const progress = new Value(0)

  // const opacity = interpolate(progress, {
  //   inputRange: [0, 1],
  //   outputRange: show ? [0, 1] : [1, 0],
  //   extrapolate: Extrapolate.CLAMP
  // })
  const time = new Value(-1);
  useCode(
    () =>
      block([
        // 1. If the clock is not running
        // start the clock and save the original clock value in
        cond(eq(time, -1), [
          set(from, progress),
          set(to, show ? 1 : 0),
          startClock(clock),
          set(time, clock)
        ]),
        // 2. Calculate the progress of the animation
        set(
          progress,
          interpolate(clock, {
            inputRange: [time, add(time, duration)],
            outputRange: [from, to],
            extrapolate: Extrapolate.CLAMP
          })
        )
      ]),
    [clock, from, progress, show, time, to])

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={{opacity: progress}}>
          <Image source={Tiziano} />
          {/* <View style={styles.box}/> */}
        </Animated.View>
      </View>
        <Button 
        title={show ? "Nascondi Tiziano" : "Mostra Tiziano"}
        onPress={() => setShow(show => !show)}
        />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box : {
    width: 100,
    height: 100,
    backgroundColor: 'red'
  }
});
