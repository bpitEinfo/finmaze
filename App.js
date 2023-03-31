import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Fragment } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc, collection } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTrjNUeeX0pr4aGQHwql8Yn8w9QXXLrP4",
  authDomain: "qrdata-9de7d.firebaseapp.com",
  projectId: "qrdata-9de7d",
  storageBucket: "qrdata-9de7d.appspot.com",
  messagingSenderId: "537084629476",
  appId: "1:537084629476:web:1fe3d7cd087a4797aff7f1",
};

function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    
    hello1(data);
    alert(`Bar code with type ${type} and data ${data.replace(/[{}"]/g, '')} has been scanned!`);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setBarcodeData(null);
  };

  if (hasPermission === null) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore();
  const specialDay = doc(firestore, "day1/RkR3YfHoEiy2yn0dn3A4");

  function hello1(data) {
    const docData = JSON.parse(data);
    addDoc(collection(firestore, "day1"), docData);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text
        style={{top: -60, fontSize: 24, fontWeight: '600'}}
        >Scan Your Data Here !</Text>
      </View>
      <View style={{backgroundColor: 'blue',marginBottom: -20,marginLeft:10, marginRight: 10, borderRadius: 20 ,padding: 10,paddingBottom: -10, height: 500,flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop: 40}}>
      <View style={styles.scanner}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 500, width: 500, }}
      />
      </View>
      {scanned && (
        <Fragment style={{flexDirection: "row", justifyContent:'flex-start'}}>
          <Text style={styles.barcodeText}>Scanned Data: {barcodeData.replace(/[{}"]/g, '')}</Text>
          <Button title="Scan Again" onPress={handleScanAgain} />
          </Fragment>
      )}
      </View>
      
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center'
  },
  scanner: {
    margin: 0,
    padding: 0,
    top: - 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 330,
    overflow: 'hidden',
    borderRadius: 10,
   // backgroundColor: 'teal',
    zIndex: -1
  },
  barcodeData: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
  },
  barcodeText: {
    color: 'white',
    fontSize: 13,
    marginBottom: 10,
  },
});
