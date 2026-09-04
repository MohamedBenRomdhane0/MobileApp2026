import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

export type CheckoutRouteParams = RootStackParamList[typeof PATHS.APP.PLANS_CHECKOUT];

export type CheckoutScreenProps = {
  route: RouteProp<RootStackParamList, typeof PATHS.APP.PLANS_CHECKOUT>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    typeof PATHS.APP.PLANS_CHECKOUT
  >;
};

export type CheckoutMethod = "baqa" | "transfer";

export type CheckoutStep = "select" | "confirm";
