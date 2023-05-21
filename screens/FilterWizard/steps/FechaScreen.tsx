import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../../../shared/store/WizardStore";
import { Button, Checkbox, MD3Colors, ProgressBar, Divider } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

interface FormData {
  termsAccepted: string;
  privacyAccepted: string;
}

export default function FechaScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      WizardStore.update((s) => {
        s.progress = 66;
      });

      console.log("updated state...", WizardStore.getRawState().progress);
    }
  }, [isFocused]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({mode: "onBlur", defaultValues: WizardStore.useState((s) => s) });

  const onSubmit = (data: FormData) => {
    WizardStore.update((s) => {
      s.progress = 100;
    });
    navigation.navigate("Confirmation");
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={WizardStore.useState((s) => s.progress) / 100}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formEntry}>
          
        </View>
        <Divider />
        <View style={styles.formEntry}>
          
        </View>
        <Divider />
        <Button
          mode="outlined"
          style={[styles.button, { marginTop: 40 }]}
          onPress={() => navigation.goBack()}
        >
          GO BACK
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          mode="outlined"
          style={styles.button}
        >
          NEXT
        </Button>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    // margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
  },
});