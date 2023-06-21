import { Text, TouchableOpacity, StyleSheet, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { CustomButtonProps } from "../../tfmmobile";
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  buttonText,
  colorButtom,
  colorText,
  colorButtomHover,
  colorTextHover,
  iconLeft,
  iconRight,
  animated,
  visible
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const opacity = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    setIsHovered(true);
  };

  const handlePressOut = () => {
    setIsHovered(false);
  };

  const styles = StyleSheet.create({
    button: { backgroundColor: colorButtom },
    buttonHovered: {
      backgroundColor: colorButtomHover
    },
    buttonText: { color: colorText },
    buttonTextHovered: { color: colorTextHover },
  });

  const buttonStyle = isHovered ? styles.buttonHovered : styles.button;
  const textStyle = isHovered ? styles.buttonTextHovered : styles.buttonText;

  useEffect(() => {
    if (visible) {
      // Mostrar el botón con animación
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Ocultar el botón con animación
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <View style={{ marginLeft: 8, marginRight: 8 }}>
      {
        animated && (
          <Animated.View style={{ opacity }}>
            {visible && (
                    <TouchableOpacity
                    activeOpacity={.6}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={buttonStyle}
                    className='w-full rounded-md p-3 bg-transparent flex justify-center items-center mt-3 border-[2px] border-[#106F69] border-solid'
                    onPress={onPress}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {iconLeft && <Icon style={{ ...textStyle, marginRight: 10, marginTop: 5 }} name={iconLeft} size={20} color="#fff" />}
                      <Text style={textStyle} className='text-[18px] font-semibold'>
                        {buttonText}
                      </Text>
                      {iconRight && <Icon style={{ ...textStyle, marginLeft: 10, marginTop: 5 }} name={iconRight} size={20} color="#fff" />}
                    </View>
                  </TouchableOpacity>
            )}
          </Animated.View>
        ) ||
        !animated && (
          <TouchableOpacity
          activeOpacity={.6}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={buttonStyle}
          className='w-full rounded-md p-3 bg-transparent flex justify-center items-center mt-3 border-[2px] border-[#106F69] border-solid'
          onPress={onPress}
        >
          <View style={{ flexDirection: 'row' }}>
            {iconLeft && <Icon style={{ ...textStyle, marginRight: 10, marginTop: 5 }} name={iconLeft} size={20} color="#fff" />}
            <Text style={textStyle} className='text-[18px] font-semibold'>
              {buttonText}
            </Text>
            {iconRight && <Icon style={{ ...textStyle, marginLeft: 10, marginTop: 5 }} name={iconRight} size={20} color="#fff" />}
          </View>
        </TouchableOpacity>
        )
      }
    </View>
  );
};

export default CustomButton;
