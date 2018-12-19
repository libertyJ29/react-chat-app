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
    }
  }

  handleChange(event) {
    this.setState({ newInputMessage: event.target.value });
  }

  handleSend() {
    if (this.state.newInputMessage) {
      var MyDate = new Date();

      var MyDateString =
        MyDate.getDate() +
        "/" +
        (MyDate.getMonth() + 1) +
        "/" +
        MyDate.getFullYear();

      //format current time with leading 0
      var MyTimeString =
        ("0" + MyDate.getHours()).slice(-2) +
        ":" +
        ("0" + MyDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + MyDate.getSeconds()).slice(-2);

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

  componentWillMount() {
    this.messageRef.limitToLast(100).on("value", message => {
      const showList = message.val();
      let newList = [];
      for (let showId in showList) {
        newList.push({
          id: showId, //get the message unique id from the firebase object
          message: showList[showId].message,
          userName: showList[showId].userName,
          date: showList[showId].date,
          time: showList[showId].time,
          edit: false
        });
      }

      this.setState({
        list: newList
      });
      //console.log('list', JSON.stringify(newList))
    });
  }

  //receive the updated message value back from child(Message)
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

  //receive the deleted message from child(Message) to be deleted from list
  onDeleteMessage = message => {
    //delete message in firebase
    this.messageRef.child(message.id).remove();

    //filter out the message to delete from state list
    const newList = this.state.list.filter(i => i.id !== message.id);

    this.setState({ list: newList });
  };

  render() {
    return (
      <div className="form">
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
      </div>
    );
  }
}
