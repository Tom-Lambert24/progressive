import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState()

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);