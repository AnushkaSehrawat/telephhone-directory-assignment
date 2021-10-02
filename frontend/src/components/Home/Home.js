import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";

import ContactTable from "../ContactTable/ContactTable";

import * as apis from "../../api/apis";

import "./Home.css";
import Search from "../Search/Search";

class Home extends Component {
  state = {
    headcells: [],
    rows: [],
    loading: false,
    copy: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    apis
      .headerData()
      .then((resp) => {
        this.setState({ headcells: resp.data.data });
        apis
          .listContacts()
          .then((res) => {
            this.setState({
              rows: res.data.data,
              copy: res.data.data,
              loading: false,
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ loading: false });
          });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  sort = (property, order) => {
    this.setState({ loading: true });
    apis
      .sort(property, order)
      .then((resp) => {
        this.setState({ rows: resp.data.data, loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  createContact = () => {
    this.props.history.push("/create");
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
      <div className="home">
        {this.state.loading ? loader : null}
        <Card>
          <div style={{ display: "inline-flex", width: "100%" }}>
            <div className="search">
              <Search
                setData={(data) => this.setState({ rows: data })}
                reset={() =>
                  this.setState({
                    rows: JSON.parse(JSON.stringify(this.state.copy)),
                  })
                }
              ></Search>
            </div>
            <div className="create-contact-btn">
              <button onClick={this.createContact} className="btn mr-2">
                Create New Contact
              </button>
            </div>
          </div>
          <ContactTable
            rows={this.state.rows}
            headcells={this.state.headcells}
            onChangeSort={(property, order) => this.sort(property, order)}
          ></ContactTable>
        </Card>
      </div>
    );
  }
}

export default Home;
