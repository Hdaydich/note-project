import { UserNotes } from "./pages/NoteBrowse/UserNotes";
import { UpdateNote } from "./pages/Note/UpdateNote";
import React from "react";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { Auth } from "./pages/Authentification/Auth";
import NewNote from "./pages/NoteCreate/NewNote";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Contact from "./pages/ForgPass/Contact";

export function App() {
  const { token, login, logout, userId } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/note" element={<UserNotes />} />
        <Route path="/" element={<UserNotes />} />
        <Route path="/note/:noteId" element={<UpdateNote />} />
        <Route path="/note/new" element={<NewNote />} />
        <Route path="*" element={<UserNotes />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Forgetten" element={<Contact />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
