import React, { Component } from "react";
import { withRouter } from "react-router";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import * as utils from "../../utils";

import "./Header.css";

class Header extends Component {
  logout = () => {
    utils.emptyLocalStorage();
    this.props.history.replace("/login");
  };

  render() {
    return (
      <AppBar position="fixed" style={{ background: "#0072CE" }}>
        <div className="row">
          <div className="col-11">
            <Toolbar className="heading">
              <h3>TELEPHONE DIRECTORY</h3>
            </Toolbar>
          </div>
          <div className="col-1">
            <div className="logout" onClick={this.logout}>
              LOGOUT
            </div>
          </div>
        </div>
      </AppBar>
    );
  }
}

export default withRouter(Header);
