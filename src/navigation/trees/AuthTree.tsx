import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@config/types/navigation.types";
import { PATHS } from "../../config/constants/paths";

// import WelcomeScreen from '../../screens/auth/WelcomeScreen'
import SignInScreen from "../../screens/auth/login/SignInScreen";
import SignUpScreen from '../../screens/auth/signup/SignUpScreen'
import ForgetPasswordScreen from "src/screens/auth/forgetPassword/ForgetPasswordScreen";
import VerificationScreen from "src/screens/auth/verify/VerificationScreen";
import ResetPasswordScreen from "src/screens/auth/resetpassword/ResetPasswordScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthTree() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PATHS.AUTH.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={PATHS.AUTH.SIGN_UP} component={SignUpScreen} /> 
      <Stack.Screen name={PATHS.AUTH.FORGET_PASSWORD} component={ForgetPasswordScreen} />
    <Stack.Screen name={PATHS.AUTH.VERIFICATION} component={VerificationScreen} />
     <Stack.Screen name={PATHS.AUTH.RESET_PASSWORD} component={ResetPasswordScreen} /> 
      {/* <Stack.Screen name={PATHS.AUTH.WELCOME} component={WelcomeScreen} />*/}
    </Stack.Navigator>
  );
}
