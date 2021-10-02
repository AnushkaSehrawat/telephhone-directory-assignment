import React, { Component } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as api from "../../api/apis";

import "./Search.css";

class Search extends Component {
  state = {
    attribute: "",
    value: "",
    loading: false,
  };

  searchResults = () => {
    this.setState({ loading: true });
    api
      .search(this.state.attribute, this.state.value)
      .then((res) => {
        this.setState({ loading: false });
        this.props.setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  reset = () => {
    this.props.reset();
    this.setState({ attribute: "", value: "" });
  };

  render() {
    const loader = (
      <div className="loader-overlay">
        <div className="react-loader">
          <CircularProgress size={50} />
        </div>
      </div>
    );
    return (
      <div className="search-component">
        {this.state.loading ? loader : null}
        <Box sx={{ minWidth: 120 }}>
          <FormControl style={{ width: "250px" }}>
            <InputLabel id="demo-simple-select-label">Attribute</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.attribute}
              label="Attribute"
              onChange={(event) =>
                this.setState({ attribute: event.target.value })
              }
            >
              <MenuItem value={"first_name"}>First Name</MenuItem>
              <MenuItem value={"last_name"}>Last Name</MenuItem>
              <MenuItem value={"middle_name"}>Middle Name</MenuItem>
              <MenuItem value={"landline"}>Landline</MenuItem>
              <MenuItem value={"mobile"}>Mobile</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TextField
          id="outlined-basic"
          value={this.state.value}
          onChange={(event) => this.setState({ value: event.target.value })}
          label="Value"
          variant="outlined"
        />
        <div onClick={this.searchResults} className="search-icon">
          <SearchIcon />
        </div>
        <button className="reset btn" onClick={this.reset}>
          Reset
        </button>
      </div>
    );
  }
}

export default Search;
