import 'regenerator-runtime/runtime';
import React, { Component, createRef } from 'react';
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
import './App.css';
import * as faceapi from 'face-api.js'
import { createCanvas, loadImage } from 'canvas';
import './assets/main.css';

const MODEL_URL = `http://127.0.0.1:8080/models`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      image: {}
    }
    this.canvasRef = createRef(null)
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.updateImg = this.updateImg.bind(this);
  }

  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    console.log("come in sign in flow")
    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    await this.welcome();
  }

  async welcome() {
    const response = await this.props.contract.welcome({ account_id: accountId });
    this.setState({ speech: response.text });

    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    console.log('loaded')
  }

  async requestSignIn() {
    const appTitle = 'NEAR React template';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  async changeGreeting() {
    await this.props.contract.setGreeting({ message: 'howdy' });
    await this.welcome();
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      speech: null
    })
  }

  updateImg(e) {
    const self = this
    var reader = new FileReader();
    reader.onload = async function () {
      var dataURL = reader.result;
      var output = document.getElementById('output');
      output.src = dataURL;
      const x = await faceapi.detectAllFaces(output, new faceapi.SsdMobilenetv1Options())
      const y = await faceapi.detectAllFaces(output, new faceapi.TinyFaceDetectorOptions())
      const faces = x.map(x => ({
        x: x.box.topLeft.x,
        y: x.box.topLeft.y,
        w: x.box.width,
        h: x.box.height
      }))

      const threshold = 4

      // Output Canvas and Context
      const outputCanvas = self.canvasRef.current;
      const outputCtx = outputCanvas.getContext('2d')

      self.setState({
        image: output
      })

      // Hidden Canvas and Context
      const hiddenCanvas = createCanvas(output.width, output.height)
      const hiddenCtx = hiddenCanvas.getContext('2d')

      // Load Image
      loadImage(dataURL).then((newImage) => {
        // New canvases for applying blurring and feathering (canvases for inverted mask of blurred images)
        const imaskCanvas = createCanvas(output.width, output.height);
        const imaskCtx = imaskCanvas.getContext('2d');
        const imaskCanvas2 = createCanvas(output.width, output.height);
        const imaskCtx2 = imaskCanvas2.getContext('2d');

        // Set global composite operation to destination in
        imaskCtx.globalCompositeOperation = "destination-in";

        // Draw blurred faces to inverted mask canvas (x,y,w,h are modified due to blurring and feathering)
        faces.forEach((face, i) => {
          // Determine the blur amount by width of face
          let blurAmount = threshold
          if (face.w >= 300) blurAmount = threshold * 2.5
          else if (face.w <= 30) blurAmount = threshold * 0.25

          hiddenCtx.filter = `blur(${blurAmount}px)`; // Add blur filter
          hiddenCtx.drawImage(newImage, 0, 0, output.width, output.height); // Draw original image to hidden canvas
          imaskCtx.putImageData(hiddenCtx.getImageData(face.x - 10, face.y - 10, face.w + 20, face.h + 20), face.x - 10, face.y - 10) // Add blurred faces to blank canvas 
        })

        // Draw blurred faces onto 2nd inverted mask canvas 
        imaskCtx2.drawImage(imaskCanvas, 0, 0);
        imaskCtx2.shadowColor = "black"; // Required for feathering
        imaskCtx2.shadowBlur = 30;
        imaskCtx2.globalCompositeOperation = "destination-in";

        // Feathering
        imaskCtx2.shadowBlur = 20;
        imaskCtx2.drawImage(imaskCanvas, 0, 0);
        imaskCtx2.shadowBlur = 10;
        imaskCtx2.drawImage(imaskCanvas, 0, 0);

        // Clear visible canvas then draw original image to it and then add the blurred images
        outputCtx.clearRect(0, 0, output.width, output.height);
        outputCtx.drawImage(newImage, 0, 0);
        outputCtx.drawImage(imaskCanvas2, 0, 0);
      })
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  render() {
    let style = {
      fontSize: "1.5rem",
      color: "#0072CE",
      textShadow: "1px 1px #D1CCBD"
    }
    return (
      <div className="bg-dark-0 max-w-2xl m-auto">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" />
          <p><span role="img" aria-label="fish">🐟</span> NEAR protocol is a new blockchain focused on developer productivity and useability!<span role="img" aria-label="fish">🐟</span></p>
          <p><span role="img" aria-label="chain">⛓</span> This little react app is connected to blockchain right now. <span role="img" aria-label="chain">⛓</span></p>
          <p style={style}>{this.state.speech}</p>
        </div>
        <div>
          {this.state.login ?
            <div>
              <button onClick={this.requestSignOut}>Log out</button>
              <button onClick={this.changeGreeting}>Change greeting</button>
            </div>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>
        <div>
          <div className="logo-wrapper">
            <img src={near} className="App-logo margin-logo" alt="logo" />
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <input type="file" onChange={this.updateImg} />
          <canvas
            ref={this.canvasRef}
            width={this.state.image.width}
            height={this.state.image.height}
            style={{ maxWidth: "100%", maxHeight: "auto" }}
          />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            <img id="output" />
          </div>
          <p><span role="img" aria-label="net">🕸</span> <a className="App-link" href="https://nearprotocol.com">NEAR Website</a> <span role="img" aria-label="net">🕸</span>
          </p>
          <p><span role="img" aria-label="book">📚</span><a className="App-link" href="https://docs.nearprotocol.com"> Learn from NEAR Documentation</a> <span role="img" aria-label="book">📚</span>
          </p>
        </div>
      </div>
    )
  }

}

export default App;
