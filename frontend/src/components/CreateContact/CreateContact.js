import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as api from "../../api/apis";

import "./CreateContact.css";
import { TextField } from "@material-ui/core";

class CreateContact extends Component {
  state = {
    fields: [],
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    api
      .headerData()
      .then((resp) => {
        for (let obj of resp.data.data) {
          obj["value"] = "";
          obj["error"] = null;
        }
        this.setState({ fields: resp.data.data, loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  validateIndividualField = (obj) => {
    let copy = JSON.parse(JSON.stringify(this.state.fields));
    copy = copy.map((ob) => {
      if (obj.name == ob.name) {
        if (ob.required) {
          if (ob.value == "") {
            ob.error = true;
          } else {
            ob.error = false;
          }
        } else if (ob.name == "email") {
          if (ob.value != "") {
            if (!this.validateEmail(ob.value)) {
              ob.error = true;
            } else {
              ob.error = false;
            }
          } else {
            ob.error = false;
          }
        }
      }
      return ob;
    });
    this.setState({ fields: copy });
  };

  handleChange = (value, obj) => {
    let copy = JSON.parse(JSON.stringify(this.state.fields));
    copy = copy.map((ob) => {
      if (ob.name == obj.name) {
        ob.value = value;
      }
      return ob;
    });
    this.setState({ fields: copy });
  };

  getDetails = (obj) => {
    return (
      <div>
        <TextField
          label={obj.label}
          value={obj.value}
          required={obj.required}
          error={obj.error}
          helperText={
            obj.error && obj.name == "email"
              ? "Invalid email"
              : obj.error
              ? "Empty Field"
              : null
          }
          onBlur={() => this.validateIndividualField(obj)}
          onChange={(event) => this.handleChange(event.target.value, obj)}
        ></TextField>
      </div>
    );
  };

  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validateAllFields = () => {
    let copy = JSON.parse(JSON.stringify(this.state.fields));
    let isValid = true;
    copy = copy.map((ob) => {
      if (ob.required) {
        if (ob.value == "") {
          ob.error = true;
          isValid = false;
        } else {
          ob.error = false;
          isValid = true;
        }
      } else if (ob.name == "email") {
        if (ob.value != "") {
          if (!this.validateEmail(ob.value)) {
            ob.error = true;
            isValid = false;
          } else {
            ob.error = false;
            isValid = true;
          }
        } else {
          ob.error = false;
          isValid = true;
        }
      }
      return ob;
    });
    this.setState({ fields: copy });
    return isValid;
  };

  saveContact = () => {
    if (this.validateAllFields()) {
      let payload = {};
      let copy = JSON.parse(JSON.stringify(this.state.fields));
      for (let field of copy) {
        if (field.value != "") {
          payload[field.name] = field.value;
        }
      }
      this.setState({ loading: true });
      api
        .createContact(payload)
        .then((res) => {
          console.log("Success!!");
          this.setState({ loading: false });
          this.props.history.push("/");
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
        });
    }
  };

  render() {
    const loader = (
      <div className="loader-overlay">
        <div className="react-loader">
          <CircularProgress size={50} />
        </div>
      </div>
    );
    const columns = [];
    for (let ind = 0; ind < this.state.fields.length; ind += 2) {
      let div1 = null;
      let div2 = null;
      let combinedDiv = null;
      if (
        ind < this.state.fields.length &&
        this.state.fields[ind].name != "created_at"
      ) {
        div1 = this.getDetails(this.state.fields[ind]);
      }
      if (
        ind + 1 < this.state.fields.length &&
        this.state.fields[ind + 1].name != "created_at"
      ) {
        div2 = this.getDetails(this.state.fields[ind + 1]);
      }
      if (div1 && div2) {
        combinedDiv = [div1, div2];
      } else if (div1) {
        combinedDiv = div1;
      } else if (div2) {
        combinedDiv = div2;
      }
      if (combinedDiv) {
        columns.push(<div className="col-4">{combinedDiv}</div>);
      }
    }
    return (
      <div className="create-contact">
        {this.state.loading ? loader : null}
        <Card>
          <div className="row fields">{columns}</div>
          {columns.length > 0 ? (
            <div className="create-contact-btn">
              <button onClick={this.saveContact} className="btn">
                SAVE
              </button>
            </div>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default CreateContact;
