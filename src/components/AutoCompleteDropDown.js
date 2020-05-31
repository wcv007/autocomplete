import React, { Component } from "react";

import "../App.css";

class AutoCompleteDropDown extends Component {
  constructor(props) {
    super(props);
    this.clickedMovie = this.clickedMovie.bind(this);
  }

  clickedMovie(res) {
    this.props.clickMovie(res);
  }
  render() {
    const { res } = this.props;
    return (
      <div
        key={res.imdbID}
        className="searchRow"
        id={res.imdbID}
        onClick={() => this.clickedMovie(res)}
      >
        <p className="movieP1">{res.Title}</p>
        <p className="movieP2">{res.Year}</p>
      </div>
    );
  }
}

export default AutoCompleteDropDown;
