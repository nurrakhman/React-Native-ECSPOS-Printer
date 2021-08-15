/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [isBluetoothActive, setBluetoothActive] = useState('-');
  const [devices, setDevices] = useState({paired: [], found: []});
  var image =
    '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';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const scanDevice = async () => {
    console.log('scanning');
    await BluetoothManager.scanDevices().then(s => {
      var ss = JSON.parse(s); //JSON string
      console.log(s);
      setDevices({paired: ss.paired, found: ss.found});
    });
    console.log('finish scanning');
  };

  const getConectedDevice = async () => {
    await BluetoothManager.getConnectedDeviceAddress().then(s => {
      // var ss = JSON.parse(s); //JSON string
      console.log(s);
      alert(s);
      // setDevices({paired: ss.paired, found: ss.found});
    });
    console.log('finish scanning');
  };

  const generateDeviceList = () => {
    var list;
    console.log(devices);
    // if (data) {

    return devices.paired.map(device => {
      return (
        <>
          <Button
            title={device.name}
            onPress={() => connectDevice(device.address)}
          />{' '}
        </>
      );
    });
    // }
    return <View>{list}</View>;
  };

  const connectDevice = async address => {
    console.log(address);
    await BluetoothManager.connect(address).then(
      s => {
        console.log('connecting to ' + address);
        alert(s);
      },
      e => {
        alert(e);
      },
    );
  };

  const print = async () => {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    await BluetoothEscposPrinter.setBlob(0);
    // await BluetoothEscposPrinter.printText("Hello World ! \n\r",{
    // });
    // // await BluetoothEscposPrinter.setBlob(0);
    // // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // // });
    // // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // // });
    // // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // // });
    // // await BluetoothEscposPrinter.printText("\n\r",{
    // // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{});
    // await BluetoothEscposPrinter.printBarCode("GINCODE", BluetoothEscposPrinter.BARCODETYPE.CODE128, 3, 120, 0, 2);
    await BluetoothEscposPrinter.printPic(image, {width: 350, left: 15});
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    await BluetoothEscposPrinter.printText(
      'Jl. Cipaku Indah V No.19A Ledeng,\n\r',
      {fonttype: 1},
    );
    await BluetoothEscposPrinter.printText(
      'Kec. Cidadap, Kota Bandung, Jawa Barat 40143, Indonesia  \n\r',
      {fonttype: 1, widthtimes: 3, heigthtimes: 3},
    );
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('RI5M8O\n\r', {});
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await BluetoothEscposPrinter.printText('Candle Holder \n\r', {});
    await BluetoothEscposPrinter.printColumn(
      [4, 2, 12, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['4', 'X', '64.000', '256.000'],
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT,
    );
    await BluetoothEscposPrinter.printText('Kursi kayu \n\r', {});
    await BluetoothEscposPrinter.printColumn(
      [4, 2, 12, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['10', 'X', '200.000', '2.000.000'],
      {},
    );
    await BluetoothEscposPrinter.printColumn(
      [18, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Tax(10%)', '225.600'],
      {},
    );
    await BluetoothEscposPrinter.printText(
      '--------------------------------\n\r',
      {},
    );
    await BluetoothEscposPrinter.printColumn(
      [18, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Total', '2.481.600'],
      {},
    );
    await BluetoothEscposPrinter.printColumn(
      [18, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Charges (Cash)', '2.500.000'],
      {},
    );
    
    await BluetoothEscposPrinter.printColumn(
      [18, 12],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      ['Changes', '18.400'],
      {},
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER,
    );
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText(
      'Kritik dan saran hubungi @roemahku.id  \n\r',
      {fonttype: 1, widthtimes: 3, heigthtimes: 3},
    );
    await BluetoothEscposPrinter.printBarCode("RI5M8O", BluetoothEscposPrinter.BARCODETYPE.CODE128, 3, 120, 0, 2);

    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("\n\r",{
    // });
    // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // });
    // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // });
    // await BluetoothEscposPrinter.printText("Testing Gincode \n\r",{
    // });
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});

    await BluetoothEscposPrinter.printAndFeed(10);
  };

  const cekKoneksi = async () => {
    const isEnabled = await BluetoothManager.checkBluetoothEnabled();
    setBluetoothActive(isEnabled ? 'active' : 'inactive');
    console.log(isEnabled);
  };

  const enableBluetooth = async () => {
    const devices = await BluetoothManager.enableBluetooth();

    return devices
      .reduce((acc, device) => {
        try {
          return [...acc, JSON.parse(device)];
        } catch (e) {
          return acc;
        }
      }, [])
      .filter(device => device.address);
  };

  const disableBluetooth = async () => {
    const devices = await BluetoothManager.disableBluetooth();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Testing Printer ESC/POS">
            Research untuk implementasi print struck menggunakan bluetooth
            Printer berbasis ESC/POS
          </Section>
          <Section title="Cek Koneksi Bluetooth">
            Koneksi Bluetooth: {isBluetoothActive}
            {'\n'}
            <Button title="Cek Koneksi" onPress={() => cekKoneksi()} />
          </Section>
          <Section title="Cek connected Device">
            Device:
            {'\n'}
            <Button title="Cek device" onPress={() => getConectedDevice()} />
          </Section>
          <Section title="Aktivasi Bluetooth">
            <Button title="Enable" onPress={() => enableBluetooth()} />{' '}
            <Button title="Disable" onPress={() => disableBluetooth()} />
          </Section>
          <Section title="Scan Bluetooth">
            <Button title="Scan Device" onPress={() => scanDevice()} />
          </Section>
          <Section title="Daftar Device">
            Daftar bluetooth device:
            {'\n'}
            {devices && generateDeviceList()}
          </Section>
          <Section title="Test Print">
            <Button title="test" onPress={() => print()} />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
