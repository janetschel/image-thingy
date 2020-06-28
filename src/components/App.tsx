import "../assets/css/styles.css";
import "../filtrr2/loader.js";
import React, { Component } from "react";
import { AppContextProvider } from "./AppContextProvider";
import { MainComponent } from "./MainComponent";

class App extends Component {
  render() {
    return (
      <AppContextProvider>
        <MainComponent />
      </AppContextProvider>
    );
  }
}

export default App;
