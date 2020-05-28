import React from "react";
import "./SearchBar.css";
import { ButtonLoader } from "../ButtonLoader/ButtonLoader";
export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
    };
    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(e) {
    this.setState({ searchTerm: e.target.value });
  }
  search() {
    this.props.onSearch(this.state.searchTerm);
  }
  render() {
    return (
      <div className='SearchBar'>
        <input
          type='text'
          className='text-center'
          placeholder='Enter a Song Title'
          onChange={this.handleTermChange}
        />

        <ButtonLoader
          classNameProp='btn btn-lg search-button'
          defaultText='Search'
          loadingText='Searching'
          onSave={this.search}
        />
      </div>
    );
  }
}
