import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { AsyncStorage, StyleSheet, Text, View, Picker } from "react-native";

import Button from 'react-native-button';

import { writeToStorage, readFromStorage, removeFromStorage, utilizeStartDate } from "../utils";
import moment from "moment";
import AppStyle from "../AppStyle";

export default function TimeSelectorScreen({ navigation, route }) {

  const calculateStartDate = (date) => {
    var now = moment();
    date.hour(now.hour());
    date.minute(now.minute());
    date.second(now.second());
  }

  const { selectedStartDate } = route.params;

  console.log('selectedDate: ', selectedStartDate);

  const [day, setDay] = useState('14');

  useEffect(() => {
  }, []);


  const days = [];

  for (var i = 1; i <= 30; i++) {
    days.push(i);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Duration</Text>
      <Picker
        selectedValue={day}
        onValueChange={(val) => { setDay(val) }}
      >
        {days.map((item, index) => {
          return (
            <Picker.Item label={item.toString()} value={item.toString()} key={item} />
          );
        })}

      </Picker>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={async () => {
            await writeToStorage("quarantineDurationInDays", day);
            // utilizeStartDate(JSON.parse(date));
            await writeToStorage("quarantineStartDate", utilizeStartDate(JSON.parse(selectedStartDate)));
            navigation.reset({
              index: 0,
              routes: [{ name: 'App' }],
            });
            navigation.navigate("App");
          }}
        >
          Start
          </Button>
      </View>

    </View>
  );
}



TimeSelectorScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false
};

const styles = StyleSheet.create({
  container: {
    ...AppStyle.container
  },
  header: {
    ...AppStyle.header
  },
  dummyStyle: { marginTop: 60 },
  button: {
    ...AppStyle.defaultButton
  },
  buttonContainer: {
    ...AppStyle.defaultButtonContainer,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
