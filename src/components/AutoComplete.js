import React, { Component } from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import * as _ from "lodash";
import "../App.css";
import { MOVIES_DATA_URL } from "../common/constants";
class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.currentFocus = -1;
    this.state = {
      search: "",
      data: null,
      showResults: false,
      selectedMovie: "",
      dataHover: null,
      selectedMovieList: [],
      limit: false,
    };
    this.changeText = this.changeText.bind(this);
    this.getData = this.getData.bind(this);
    this.onMovieResultClicked = this.onMovieResultClicked.bind(this);
    this.clickMovie = this.clickMovie.bind(this);
    this.removeMovie = this.removeMovie.bind(this);
    this.clickOutside = this.clickOutside.bind(this);
  }

  changeText(e) {
    if (e && e.target) {
      this.setState({ search: e.target.value }, () => {
        if (this.state.search.length >= 3) {
          _.debounce(this.getData, 300)();
        } else {
          this.setState({ data: null });
        }
      });
    }
  }
  getData() {
    const url = MOVIES_DATA_URL + this.state.search;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.currentFocus = -1;
        if (res.Response === "True") {
          this.setState({ data: res && res.Search, showResults: true });
        }
        if (res.Response === "False") {
          this.setState({ showResults: true, data: [] });
        }
      })
      .catch((err) => {});
  }

  clickMovie(data) {
    if (this.state.selectedMovieList.length === 5) {
      this.setState({
        limit: true,
        data: null,
        search: "",
        showResults: false,
      });
    } else if (data.imdbID && this.state.selectedMovieList.length < 5) {
      this.setState(
        {
          selectedMovieList: [...this.state.selectedMovieList, data],
          data: null,
          search: "",
          showResults: false,
        },
        () => {
          if (this.state.selectedMovieList.length === 5) {
            this.setState({ limit: true });
          }
        }
      );
    }
  }

  onMovieResultClicked(e) {}

  removeMovie(val) {
    let newState = this.state.selectedMovieList.slice();
    for (let i = 0; i < newState.length; i++) {
      if (newState[i].imdbID === val.imdbID) {
        newState.splice(i, 1);
      }
    }

    this.setState({ selectedMovieList: newState, limit: false });
  }

  clickOutside(e) {
    if (this.moviesSearchRef && !this.moviesSearchRef.contains(e.target)) {
      this.setState({
        data: null,
        search: "",
        showResults: false,
      });
    }
  }
  componentDidMount() {}
  render() {
    const { search, data, selectedMovieList, showResults, limit } = this.state;
    return (
      <div className="parentDiv" onClick={this.clickOutside}>
        {limit && (
          <div className="warning">
            Limit Reached. Maximum 5 movies can be added.
          </div>
        )}
        <div className="autoCompleteDiv">
          <span className="movieSpan">
            {selectedMovieList.map((val) => (
              <span className="movieList" key={val.imdbID}>
                <span className="movieText">{val.Title}</span>
                <span className="tooltipSpan">{val.Title}</span>
                <span
                  className="movieCross"
                  onClick={() => this.removeMovie(val)}
                >
                  x
                </span>
              </span>
            ))}
          </span>
          <input
            type="text"
            value={search}
            onChange={this.changeText}
            className="autoCompleteInput"
          />
        </div>
        <div className="separator"></div>
        {showResults && (
          <div>
            {data && data.length > 0 && (
              <div
                className="dropDownContainer"
                ref={(node) => (this.moviesSearchRef = node)}
                onClick={this.onMovieResultClicked}
              >
                {data.map((res) => {
                  return (
                    <AutoCompleteDropDown
                      key={res.imdbID}
                      id={res.imdbID}
                      res={res}
                      hoveredId={this.state.dataHover}
                      clickMovie={this.clickMovie}
                    />
                  );
                })}
              </div>
            )}
            {data && data.length === 0 && (
              <div className="dropDownContainer">
                <div className="searchRow">
                  {" "}
                  <p className="movieP1">No Movies Found</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default AutoComplete;
