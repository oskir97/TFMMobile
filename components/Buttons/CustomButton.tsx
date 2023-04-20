import { View, Text, Pressable } from "react-native";
import React from "react";
import { CustomButtonProps } from "../../tfmmobile";

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  buttonClassNames,
  textClassNames,
  buttonText,
}) => {
  return (
    <Pressable className={`${buttonClassNames}`} onPress={onPress}>
      <Text className={`${textClassNames}`}>
        {buttonText}
      </Text>
    </Pressable>
  );
};
export default CustomButton;
