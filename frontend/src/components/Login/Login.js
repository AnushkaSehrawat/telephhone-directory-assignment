import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as api from "../../api/apis";
import * as utils from "../../utils";

import "./Login.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
    error: null,
    loading: false,
  };

  login = () => {
    this.setState({ loading: true });
    api
      .login(this.state.username, this.state.password)
      .then((resp) => {
        if (resp.status != 200) {
          this.setState({
            error: "Incorrect username/password",
          });
        } else {
          utils.setLocalStorage(
            resp.data.data.token,
            resp.data.data.user.name,
            resp.data.data.user.id
          );
          this.props.history.push("/");
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  render() {
    const loader = (
      <div className="loader-overlay">
        <div className="react-loader">
          <CircularProgress size={50} />
        </div>
      </div>
    );
    let content = (
      <div className="login-card">
        {this.state.loading ? loader : null}
        <picture className="background-login-image">
          <img src="https://login.reltio.com/bg.png"></img>
        </picture>
        <Card style={{ position: "relative" }}>
          {/* {The Position relative is used to keep the card on top of image} */}
          <CardContent>
            <div>
              {this.state.error ? (
                <p className="error-msg"> {this.state.error}</p>
              ) : null}
              <div className="login-details">
                <TextField
                  id="standard-basic"
                  value={this.state.username}
                  label="Username or email address"
                  onChange={(event) =>
                    this.setState({ username: event.target.value })
                  }
                ></TextField>
                <TextField
                  id="standard-basic"
                  value={this.state.password}
                  type="password"
                  label="Password"
                  onChange={(event) =>
                    this.setState({ password: event.target.value })
                  }
                ></TextField>
              </div>
              <div className="login-action">
                <Button
                  type="button"
                  variant="contained"
                  onClick={this.login}
                  color="secondary"
                >
                  LOG IN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
    return content;
  }
}

export default Login;
