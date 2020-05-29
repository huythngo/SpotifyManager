import React from "react";
import "./App.css";
import { SearchResult } from "../SearchResult/SearchResult";
import { PlayList } from "../PlayList/PlayList";
import { SearchBar } from "../SearchBar/SearchBar";
import Spotify from "../../util/Spotify";

const searchResult = [];
const playlistName = "";
const playlistTracks = [];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: searchResult,
      playlistTracks: playlistTracks,
      playlistName: playlistName,
      userProfile: {},
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
  }
  addTrack(track) {
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    }
    let newTracks = this.state.playlistTracks;
    newTracks.push(track);
    this.setState({ playlistTracks: newTracks });
  }

  removeTrack(track) {
    let newTracks = this.state.playlistTracks.filter(
      (savedTrack) => savedTrack.id !== track.id
    );
    this.setState({ playlistTracks: newTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    if (trackUris.length <= 0) {
      return;
    }
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(
      () => {
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: [],
        });
      },
      (e) => {
        console.log(e.message);
      }
    );
  }

  getUserProfile() {
    Spotify.searchUserProfile().then((profile) => {
      this.setState({
        userProfile: profile,
      });
    });
  }

  search(searchTerm) {
    this.getUserProfile();
    Spotify.search(searchTerm).then((result) => {
      this.setState({ searchResult: result });
    });
  }

  render() {
    return (
      <div>
        <div className='container-fluid'>
          <nav className='nav justify-content-center '>
            <h1 className='text-center'>Spotify Manger</h1>
          </nav>
        </div>
        <div className='App container-fluid'>
          <div className='row justify-content-center '>
            <div className='col-xs-10 col-sm-10 col-md-6 col-lg-6 col-xl-5 text-center'>
              <div className='user-info'>
                <h2>
                  Hello,{" "}
                  {this.state.userProfile.name ? (
                    this.state.userProfile.name
                  ) : (
                    <span>there</span>
                  )}
                </h2>
              </div>
              <SearchBar onSearch={this.search} />
            </div>
          </div>
          <div className='row justify-content-around'>
            <div className='col-xs-10 col-sm-9 col-md-6 col-lg-6 col-xl-5 '>
              <SearchResult
                searchResult={this.state.searchResult}
                onAdd={this.addTrack}
              />
            </div>
            <div className='col-xs-10 col-sm-9 col-md-6 col-lg-6 col-xl-4'>
              <PlayList
                playlistTracks={this.state.playlistTracks}
                playlistName={this.state.playlistName}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
        </div>
        <footer>
          <a href='https://github.com/huythngo/SpotifyManager' target='blank'>
            <i class='fab fa-github github'></i>
          </a>
          <p>
            Built with <i className='fas fa-pizza-slice'></i> and{" "}
            <i class='fas fa-mug-hot'></i>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
