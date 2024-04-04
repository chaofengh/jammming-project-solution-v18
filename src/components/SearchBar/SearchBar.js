import React, { useState, useCallback } from "react";

import "./SearchBar.css";
// this component save the user input to the 'term' - with the handleTermChange function
// when the user click the search button, it will call the search function written in the App component - which return a list of songs

const SearchBar = (props) => {
  const [term, setTerm] = useState("");

  // this function save the value user input to 'term'
  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);
  
  // this function use the function written in the App component
  // the function look up the value saved in 'term', and return resultset
  const search = useCallback(() => {
    if(term){
      props.onSearch(term);
    }
  }, [props.onSearch, term]);

  return (
    <div className="SearchBar">
      <input placeholder="Enter A Song Title" onChange={handleTermChange} />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
