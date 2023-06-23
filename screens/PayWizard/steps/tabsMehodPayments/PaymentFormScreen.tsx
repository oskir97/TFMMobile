// import {
//     StyleSheet,
//     Text,
//     View,
//     ScrollView,
//     Pressable,
//     Dimensions,
//     Linking,
//     TouchableOpacity,
//     SafeAreaView,
//     BackHandler
//   } from "react-native";
//   import { Button } from "react-native-paper";
//   import React, { useState, useEffect, useRef, useContext } from "react";
//   import { RouteProp, useFocusEffect, useLinkTo, useRoute } from "@react-navigation/native";
//   import { AntDesign } from "@expo/vector-icons";
//   import { MaterialIcons } from "@expo/vector-icons";
//   import { FontAwesome5 } from "@expo/vector-icons";
//   import MapView, { Marker } from "react-native-maps";
//   import { useTranslation } from "react-i18next";
//   import Icon from 'react-native-vector-icons/FontAwesome';
  
//   const PaymentFormScreen: React.FC = () => {
  
//     return (
//       <>
        
//         <View style={{marginLeft:10, marginRight:10}}>
//       <CardField
//         postalCodeEnabled={false}
//         placeholders={{
//           number: '4242 4242 4242 4242',
//         }}
//         cardStyle={{
//           backgroundColor: '#FFFFFF',
//           textColor: '#000000',
//         }}
//         style={{
//           width: '100%',
//           height: 50,
//           marginVertical: 30,
//         }}
//         onCardChange={(cardDetails) => {
//           console.log('cardDetails', cardDetails);
//         }}
//         onFocus={(focusedField) => {
//           console.log('focusField', focusedField);
//         }}
//       />
//     </View>
//       </>
//     );
//   };
  
//   export default PaymentFormScreen;