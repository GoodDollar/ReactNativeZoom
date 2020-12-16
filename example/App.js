/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FaceTec, { FaceTecUxEvent, FaceTecSDKStatus, FaceTecSessionStatus } from 'react-native-facetec';

export default function App () {
  const [status, setStatus] = useState('starting')
  const [message, setMessage] = useState('--')
  const subscriptionRef = useRef(null)

  useEffect(() => {
    const unsubscribe = () => {
      const { current: _unsubscribe } = subscriptionRef

      if (!_unsubscribe) {
        return
      }

      _unsubscribe()
    }

    const initialize = async () => {
      const version = await FaceTec.sdk.initialize().catch(console.log)
      const lastStatus = 'native promise resolved'
      const lastMessage = `FaceTec ${version} initialized`

      setStatus(lastStatus)
      setMessage(lastMessage)

      subscriptionRef.current = FaceTec.sdk
        .addListener(FaceTecUxEvent.UI_READY, () => {
          setStatus(`${lastStatus},\nnative event received`)
          setMessage(`${lastMessage},\nUI is ready`)
          unsubscribe()
        }
      )

      FaceTec.sdk.enroll()
    }

    console.log('SDK', {
      FaceTecUxEvent,
      FaceTecSDKStatus,
      FaceTecSessionStatus
    })

    initialize()
    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>☆FaceTec example☆</Text>
      <Text style={styles.instructions}>STATUS: {status}</Text>
      <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
      <Text style={styles.instructions}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
