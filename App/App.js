import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import Form from "../Form/Form.js";
import firebase from "firebase";
import firebaseConfig from "../config";
firebase.initializeApp(firebaseConfig);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }
  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  handleLogOut() {
    firebase.auth().signOut();
  }
  render() {
    return (
      <div className="app">
        <div className="app__header">
          {!this.state.user && (
            <img src={logo} className="app__logo" alt="logo" />
          )}
          {this.state.user && (
            <span>
              <div className="name__logo" alt="logo">
                {this.state.user.displayName}
              </div>
              <div className="name__logo_rev" alt="logo">
                logged in
              </div>
            </span>
          )}
          <h2>React & Firebase Message App</h2>
          {!this.state.user ? (
            <button
              className="app__button"
              onClick={this.handleSignIn.bind(this)}
            >
              Sign in
            </button>
          ) : (
            <button
              className="app__button"
              onClick={this.handleLogOut.bind(this)}
            >
              Logout
            </button>
          )}
        </div>
        <div className="app__list">
          <Form user={this.state.user} />
        </div>
      </div>
    );
  }
}
export default App;
