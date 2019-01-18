import React, { Component } from "react";
import "./Message.css";
export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      message: this.props.message,
      updatedMsg: "" //when editing the message
    };
    this.ToggleEdit = this.ToggleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //toggle showing the input box to edit the selected message
  ToggleEdit() {
    //only allow to edit messages created by the logged in user
    if (this.props.userName === this.props.message.userName) {
      const { edit } = this.state;
      this.setState({
        //toggle showing the input
        edit: !edit,
        updatedMsg: this.props.message.message //when showing input dialog, update the current message for this element in state
      });
    }
  }

  //delete selected message in firebase
  removeMessage(message) {
    //only allow to delete messages created by the logged in user
    if (this.props.userName === this.props.message.userName) {
      //pass the deleted message back to Form
      this.onDeleteMessage(message);
    }
  }

  //update seleted message in firebase
  updateTheMessage(index, newMsg) {
    //only allow to update messages created by the logged in user
    if (this.props.userName === this.props.message.userName) {
      //pass the updated message back to Form
      this.onUpdateMessage(index, this.state.updatedMsg);
    }
  }

  //callback to update the message in the list in Form
  onUpdateMessage(index, newMsg) {
    var updatedMessage = this.props.message;
    updatedMessage.message = newMsg;

    this.props.onUpdateMessage(updatedMessage);

    //toggle the edit input field to show the plain text
    this.ToggleEdit();
  }

  //callback to delete the message in the list in Form
  onDeleteMessage = value => {
    this.props.onDeleteMessage(value);
  };

  //update the message in state while editing the message
  handleChange({ target }) {
    this.setState({
      updatedMsg: target.value
    });
  }

  render() {
    const { edit } = this.state;
    return (
      <div className="message inline">
        <span className="message__author">{this.props.message.userName}:</span>
        {!edit && (
          <span className="mainMessageText">{this.props.message.message}</span>
        )}
        {edit && (
          <span className="editMessageContainer">
            <input
              type="text"
              className="message__input"
              defaultValue={this.state.updatedMsg}
              placeholder="Update Message"
              onChange={this.handleChange}
            />
            <i
              className="material-icons saveButton imgButton"
              onClick={() =>
                this.updateTheMessage(
                  this.props.message.id,
                  this.state.updatedMsg
                )
              }
              title="Save"
            >
              save
            </i>
          </span>
        )}{" "}
        <i className="alignTextRight">
          {this.props.message.date} {this.props.message.time}{" "}
          <i
            className="material-icons md-24 imgButton iconPadding"
            onClick={this.ToggleEdit}
            title="Edit Message"
          >
            edit
          </i>{" "}
          <i
            className="material-icons md-24 red600 imgButton"
            onClick={() => this.removeMessage(this.props.message)}
            title="Delete Message"
          >
            delete
          </i>
        </i>
      </div>
    );
  }
}
