import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from "@redux/slices/authSlice";
import { authApi } from "@redux/apis/auth/authApi";
import { childApi } from "@redux/apis/child/childApi";
import { parentApi } from "@redux/apis/parent/parentApi";
import { bookApi } from "@redux/apis/books/bookApi";
import { teacherApi } from "@redux/apis/teachers/teacherApi";
import { materialsApi } from "@redux/apis/materials/materialsApi";
import { authListenerMiddleware } from "@redux/middleware/authMiddleware";
import { coursesApi } from "@redux/apis/courses/coursesApi";
import {videoSessionApi} from "@redux/apis/videos/videoSessionApi";
import { meetingApi } from "@redux/apis/meetings/meetingApi";
import plansApi from "@redux/apis/plans/plansApi";
import { levelsApi } from "@redux/apis/levels/levelsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
    [parentApi.reducerPath]: parentApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [materialsApi.reducerPath]: materialsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [videoSessionApi.reducerPath]: videoSessionApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [levelsApi.reducerPath]: levelsApi.reducer,
    
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(authApi.middleware)
      .concat(childApi.middleware)
      .concat(parentApi.middleware)
      .concat(bookApi.middleware)
      .concat(teacherApi.middleware)
      .concat(materialsApi.middleware)
      .concat(coursesApi.middleware)
      .concat(videoSessionApi.middleware)
      .concat(meetingApi.middleware)
      .concat(plansApi.middleware)
      .concat(levelsApi.middleware)
      .concat(authListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;