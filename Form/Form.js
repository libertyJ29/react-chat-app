import React, { Component } from "react";
import "./Form.css";
import Message from "../Message/Message";
import firebase from "firebase";
export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      newInputMessage: "",
      edit: false,
      list: []
    };
    this.messageRef = firebase
      .database()
      .ref()
      .child("messages");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ userName: nextProps.user.displayName });
      this.getMessagesFromFirebase();
    }else{
      this.setState({ userName: null });
      this.clearMessagesList();
    }
  }

  handleChange(event) {
    this.setState({ newInputMessage: event.target.value });
  }

  //add new message
  handleSend() {
    if (this.state.newInputMessage) {

      //always get date using timezone GMT+0
      var timezone = 0;
      var MyDate = new Date( new Date().getTime() + timezone * 3600 * 1000); //.toUTCString().replace( / GMT$/, "" )

      //format current date with leading 0s
      var MyDateString =
        ('0' + MyDate.getDate()).slice(-2) + '/' +
        ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' +
        MyDate.getFullYear();

      //format current time with leading 0s
      var MyTimeString =
        ("0" + MyDate.getUTCHours()).slice(-2) +
        ":" +
        ("0" + MyDate.getUTCMinutes()).slice(-2) +
        ":" +
        ("0" + MyDate.getUTCSeconds()).slice(-2);

      var newItem = {
        userName: this.state.userName,
        message: this.state.newInputMessage,
        date: MyDateString,
        time: MyTimeString
      };
      this.messageRef.push(newItem);
      this.setState({ newInputMessage: "" }); //clear message in input box

    }
  }

  handleKeyPress(event) {
    if (event.key !== "Enter") return;
    this.handleSend();
  }

  //clear the list of messages, when user is logged out
  clearMessagesList(){
    let newList = [];

    this.setState({
      list: newList
    });
  }

  //get the messages from firebase, when user is logged in
  getMessagesFromFirebase() {
    this.messageRef.limitToLast(50).on("value", message => {
      const showList = message.val();
      let newList = [];

      for (let showId in showList) {
        newList.push({
          id: showId, //save the message unique id from the firebase object
          message: showList[showId].message,
          userName: showList[showId].userName,
          date: showList[showId].date,
          time: showList[showId].time,
          edit: false
        });
      }

      //sort the returned message array in reverse order based on the date and time
      newList.sort(function compare(a,b){

        var dateA = a.date.split('/').reverse().join("-");
        var dateTimeA = new Date(dateA+"T"+a.time+"Z");

        var dateB = b.date.split('/').reverse().join("-");
        var dateTimeB = new Date(dateB+"T"+b.time+"Z");

        return dateTimeB - dateTimeA;
      });

      this.setState({
        list: newList
      });

    });
  }

  //receive the updated message from child component(Message)
  onUpdateMessage = message => {
    //update message in firebase
    this.messageRef.child(message.id).update({ message: message.message });

    //get list of all messages
    const newList = this.state.list;

    //get the message to update
    const theMsgToUpdate = newList.filter(i => i.id === message.id);
    theMsgToUpdate.message = message.message;

    this.setState({ list: newList });
  };

  //receive the deleted message from child component(Message) to be deleted from list
  onDeleteMessage = message => {
    //delete message in firebase
    this.messageRef.child(message.id).remove();

    //filter out the message to delete from list in state
    const newList = this.state.list.filter(i => i.id !== message.id);

    this.setState({ list: newList });
  };

  render() {
    return (
      <div className="form">
        {this.state.userName ? (
          <div className="form__row">
            <input
              className="form__input"
              type="text"
              placeholder="Type message"
              value={this.state.newInputMessage}
              onChange={this.handleChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            <button className="form__button" onClick={this.handleSend.bind(this)}>
              Send
            </button>
          </div>
        ) : null}
        <div className="form__message">
          {this.state.list.map((item, index) => (
            <Message
              userName={this.state.userName}
              key={index}
              message={item}
              onUpdateMessage={this.onUpdateMessage}
              onDeleteMessage={this.onDeleteMessage}
            />
          ))}
      </div>
    </div>
    );
  }
}
