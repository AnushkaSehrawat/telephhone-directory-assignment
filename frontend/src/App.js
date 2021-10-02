import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { withRouter } from "react-router";

/*amCharts imports Starts*/
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import Login from "./components/Login/Login";

import "./App.css";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import CreateContact from "./components/CreateContact/CreateContact";
import ContactDetail from "./components/ContactDetail/ContactDetail";

am4core.useTheme(am4themes_animated);
/*amCharts imports Ends*/

class App extends Component {
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.replace("/login");
    }
  }

  render() {
    return (
      <div className="App">
        {!window.location.href.includes("login") ? <Header></Header> : null}
        <Switch>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/" exact component={Home}></Route>
          <Route path="/create" exact component={CreateContact}></Route>
          <Route path="/contact/:id" exact component={ContactDetail}></Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
