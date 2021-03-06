import React, { useState, useEffect } from "react";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import moment from "moment";
import CountDown from "react-native-countdown-component";
import Button from "react-native-button";
import i18n from "i18n-js";

import { QuarantineProgress } from "../components";
import Text from '../components/Text'

import { readFromStorage, removeFromStorage } from "../utils/";

import AppStyle from "../AppStyle";

export default function HomeScreen({ navigation, route }) {
  const [loading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [quarantineDurationInDays, setQuarantineDuration] = useState(0);
  const [quarantineCounter, setQuarantineCounter] = useState(0);

  const [quarantineEndDate, setQuarantineEndDate] = useState(0);

  useEffect(() => {
    async function getQuarantineCounter() {
      setIsLoading(true);

      const date = await readFromStorage("quarantineStartDate");
      const duration = await readFromStorage("quarantineDurationInDays");
      setQuarantineDuration(duration);
      const quarantineEndDate = moment(date).add(duration, "days");
      setQuarantineEndDate(quarantineEndDate);

      const countDown = quarantineEndDate.diff(moment(), "seconds");

      setQuarantineCounter(countDown);

      setIsLoading(false);
      return () => {};
    }
    getQuarantineCounter();
  }, []);

  const onPressFinishQuarantine = () => {
    Alert.alert(
      i18n.t("confirmationFinishQuarantine"),
      '',
      [
        {
          text: i18n.t("labelCancel"),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: i18n.t("labelYes"), onPress: async () => {
            await removeFromStorage("quarantineStartDate");
            await removeFromStorage("quarantineDurationInDays");
            navigation.reset({
              index: 0,
              routes: [{ name: 'DateSelector' }],
            });
          }
        },
      ],
      { cancelable: false }
    );

  }

  if (loading) {
    return (
      <View style={AppStyle.container}>
        <Text>Loading..</Text>
      </View>
    );
  }

  return (
    <ScrollView style={AppStyle.container}>
      <Text id="labelQuarantineEndsIn" style={AppStyle.header} />
      <CountDown
        until={quarantineCounter}
        size={20}
        digitStyle={styles.digitStyle}
        digitTxtStyle={styles.digitTxtStyle}
        timeLabels={{d: i18n.t("labelDay"), h: i18n.t("labelHour"), m: i18n.t("labelMinute"), s: i18n.t("labelSecond")}}
      />
      <QuarantineProgress
        quarantineDurationInDays={quarantineDurationInDays}
        quarantineCounter={quarantineCounter}
      />
      <View style={styles.buttonContainer}>

        <Button
          style={AppStyle.defaultButton}
          onPress={onPressFinishQuarantine}
        >
          {i18n.t("labelFinishMyQuarantine")}
          </Button>
      </View>

    </ScrollView>
  );
}

HomeScreen.navigationOptions = {
  headerLeft: null,
  gesturesEnabled: false
};

const styles = StyleSheet.create({
  digitStyle: {
    backgroundColor: '#48BB78'
  },
  digitTxtStyle: {
    color: 'white'
  },
  buttonContainer: {
    ...AppStyle.defaultButtonContainer,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
