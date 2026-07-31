import AsyncStorage from '@react-native-async-storage/async-storage'
import * as CryptoJS from 'crypto-js'
import { I18nManager } from 'react-native'

import { ConfigEnv } from '@config/configEnv'
import { GLOBAL_VARIABLES } from '@config/constants/globalVariables'
import { LocalStorageKeysEnum } from '@config/enums/localStorage.enum'
import type { User } from 'types/models/User'

// -------------------- Secret key --------------------
const secretKey = ConfigEnv.HASH_KEY
if (!secretKey) {
  throw new Error(
    'SECRET_KEY (EXPO_PUBLIC_HASH_KEY) is not defined in environment variables',
  )
}

// -------------------- Crypto helpers --------------------
const encrypt = (plainText: string) => {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString()
}

const decrypt = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// -------------------- Storage API --------------------
export async function getFromLocalStorage<T = string>(
  key: LocalStorageKeysEnum,
  isObject: boolean = false,
): Promise<T | null> {
  const stored = await AsyncStorage.getItem(key)
  if (!stored) return null

  try {
    const decrypted = decrypt(stored)
    if (!decrypted) return null

    if (isObject) {
      return JSON.parse(decrypted) as T
    }

    return decrypted as unknown as T
  } catch {
    return null
  }
}

export async function setToLocalStorage(
  key: LocalStorageKeysEnum,
  value: unknown,
  isObject: boolean = false,
): Promise<void> {
  const plain = isObject ? JSON.stringify(value) : String(value)
  const cryptedValue = encrypt(plain)
  await AsyncStorage.setItem(key, cryptedValue)
}

export async function removeFromLocalStorage(
  key: LocalStorageKeysEnum,
): Promise<void> {
  await AsyncStorage.removeItem(key)
}

// -------------------- User helpers --------------------
export async function getUserFromLocalStorage(): Promise<User | null> {
  return await getFromLocalStorage<User>(LocalStorageKeysEnum.User, true)
}

// -------------------- Language helpers --------------------
export async function saveLanguageToLocalStorage(language: string): Promise<void> {
  await setToLocalStorage(LocalStorageKeysEnum.Language, language, false)
}

export async function getLanguageFromLocalStorage(): Promise<string | null> {
  return await getFromLocalStorage<string>(LocalStorageKeysEnum.Language, false)
}

export function setLanguageDirection(lang: string) {
  const isRTL = lang === 'ar'
  const dir = isRTL ? GLOBAL_VARIABLES.RTL_DIRECTION : GLOBAL_VARIABLES.LTR_DIRECTION
  void dir

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL)
    I18nManager.forceRTL(isRTL)
  }
}

// -------------------- Clear storage (keep language) --------------------
export async function clearLocalStorage(): Promise<void> {
  const language = await getLanguageFromLocalStorage()
  await AsyncStorage.clear()
  if (language) {
    await saveLanguageToLocalStorage(language)
  }
}
