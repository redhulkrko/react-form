import React from "react";
import CustomLayout from "./CreateForm";
import "./App.css";
export const MyTestStore = React.createContext({})

export default function App() {
  return (
    <div className="App">
      <CustomLayout />
    </div>
  );
}
