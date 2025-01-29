import { configureStore } from "@reduxjs/toolkit";
import { noteReducer } from "./note/note-slice";
import { userReducer } from "./user/user-slice";

export const store = configureStore({
  reducer: {
    NOTE: noteReducer,
    USER :userReducer
  },
});
