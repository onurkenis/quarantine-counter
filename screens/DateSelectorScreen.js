import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppStyle from "../AppStyle";
import i18n from "i18n-js";
import * as Localization from "expo-localization";

import { StyleSheet, Text, View, Platform, Image } from "react-native";
import Button from "react-native-button";

import moment from "moment/min/moment-with-locales";

export default function DateSelectorScreen({ navigation, route }) {
  const [date, setDate] = useState(new Date());
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  moment.locale(i18n.locale);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      if (event.type === "set" || event.type === "dismissed") {
        setDateTimePickerVisible(false);
      }
    }

    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={AppStyle.container}>
      <Text style={AppStyle.header}>{i18n.t("titleChooseStartDate")}</Text>
      {(dateTimePickerVisible || Platform.OS === "ios") && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          maximumDate={new Date()}
          value={date}
          mode="date"
          locale={Localization.locale}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      {Platform.OS === "android" && (
        <Image
          style={styles.image}
          source={require("../assets/images/date-selector.png")}
        />
      )}
      <View style={styles.buttonContainer}>
        {Platform.OS === "android" && !dateTimePickerVisible && (
          <View style={styles.outlinedButtonContainer}>
            <Button
              style={AppStyle.outlinedButton}
              onPress={() => {
                setDateTimePickerVisible(true);
              }}
            >
              {moment(date).format("LL")}
            </Button>
          </View>
        )}

        <Button
          style={styles.button}
          onPress={async () => {
            navigation.navigate("TimeSelector", {
              selectedStartDate: JSON.stringify(date),
            });
          }}
        >
          {i18n.t("labelNext")}
        </Button>
      </View>
    </View>
  );
}

DateSelectorScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
};

const styles = StyleSheet.create({
  button: {
    ...AppStyle.defaultButton,
  },
  outlinedButtonContainer: {
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "contain",
  },
  buttonContainer: {
    ...AppStyle.defaultButtonContainer,
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
});
