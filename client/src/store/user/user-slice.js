import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    userList: [],
  },
  reducers: {
    setUserList: (currentSlice, action) => {
      currentSlice.userList = action.payload;
    },
    addUser: (currentSlice, action) => {
      console.log("entree") ;
      currentSlice.userList.push(action.payload);
      console.log("out") ;
    },
    updateUser: (currentSlice, action) => {
      const indexToUpdate = currentSlice.userList.findIndex(
        (user) => user.id === action.payload.id
      );
      currentSlice.userList[indexToUpdate] = action.payload;
    }, 
    findUser: (currentSlice, action) => {
      const userToFind = currentSlice.userList.findIndex(
        (user) => user.id === action.payload.id
      );
      return currentSlice.userList[userToFind];
    },
    
    deleteUser: (currentSlice, action) => {
      const filteredNoteList = currentSlice.userList.filter(
        (user) => user.email !== action.payload.email
      );
      currentSlice.userList = filteredNoteList;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setUserList, addUser, updateUser, deleteUser, findUser } =
  userSlice.actions;