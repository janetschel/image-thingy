import "../assets/css/styles.css";
import React, { Component } from "react";
import { AppContextProvider } from "./AppContextProvider";
import { MainComponent } from "./MainComponent";

class App extends Component {
  render() {
    return (
      <div>
        <AppContextProvider>
          <MainComponent />
        </AppContextProvider>
      </div>
    );
  }
}

export default App;
