import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

import "./App.css";

const app = new Clarifai.App({
  apiKey: "9446ba7cd5824fa89a6482bbc6f7c80d"
});

// https://vincentgarreau.com/particles.js/
const particlesOptions = {
  particles: {
    number: {
      value: 130,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      input: "",
      imageUrl: ""
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    // https://clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
    // https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        console.log(response);
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
