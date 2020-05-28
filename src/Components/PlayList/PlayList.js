import React from "react";
import "./PlayList.css";
import { TrackList } from "../TrackList/TrackList";
import { ButtonLoader } from "../ButtonLoader/ButtonLoader";
export class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handlNameChange = this.handlNameChange.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
  }
  handlNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  handleSaveButtonClick() {
    this.props.onSave();
    document.getElementById("PlayList-name-input").value = "New Playlist";
  }
  render() {
    return (
      <div className='PlayList'>
        <input
          type='text'
          defaultValue='New Playlist'
          onChange={this.handlNameChange}
          id='PlayList-name-input'
        />

        <TrackList
          List={this.props.playlistTracks}
          isRemoval={true}
          onRemove={this.props.onRemove}
        />

        <ButtonLoader
          classNameProp='btn btn-lg add-button'
          defaultText='Save to Spotify'
          loadingText='Saving'
          onSave={this.handleSaveButtonClick}
        />
      </div>
    );
  }
}
