import React from "react";
import "./SearchResult.css";
import { TrackList } from "../TrackList/TrackList";
export class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='SearchResult'>
        <h1>Results</h1>
        <TrackList
          List={this.props.searchResult}
          isRemoval={false}
          onAdd={this.props.onAdd}
        />
      </div>
    );
  }
}
