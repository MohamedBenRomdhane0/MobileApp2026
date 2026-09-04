// @ts-nocheck
import { Media, MediaApi } from './Media';
import { Level } from './Level';
import { User } from './User';
import { UserApi } from '@redux/apis/user/userApi.type';

export interface Child {
  id: number;
  user: User;
  media: Media[];
  level?: Level
}

export interface ChildApi {
  id: number;
  user: UserApi;
  media: MediaApi[];
  level: Level;
  gender: string;
}