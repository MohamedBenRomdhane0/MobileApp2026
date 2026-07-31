import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@config/types/navigation.types'

export type Nav = NativeStackNavigationProp<RootStackParamList, any>

export type VerificationForm = {
  code: string
}
