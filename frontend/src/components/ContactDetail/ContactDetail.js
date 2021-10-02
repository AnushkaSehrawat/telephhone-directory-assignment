import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";

import ViewGraph from "../ViewGraph/ViewGraph";

import * as api from "../../api/apis";

import "./ContactDetail.css";

class ContactDetail extends Component {
  state = {
    detail: {},
    loading: false,
    graphData: [],
    showGraph: false,
    showDetails: false,
  };

  setContactData = async (id) => {
    try {
      let res = await api.contactDetail(id);
      res.data.data.id = undefined;
      res.data.data.updatedAt = undefined;
      res.data.data.userId = undefined;
      await api.updateViewCount(id);
      let resp = await api.getViewCount(id);
      res.data.data["view_count"] = resp.data.data;
      this.setState({ detail: res.data.data });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  };

  getGraphData = async (id) => {
    try {
      let dates = this.last7Days();
      let res = await api.getViewCountGivenDate(id, dates);
      this.setState({ graphData: res.data.data });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    await this.setContactData(id);
    await this.getGraphData(id);
    this.setState({ loading: false });
  };

  getDetails = (label, value) => {
    return (
      <div className="row">
        <div className="col">
          <p className="detail-label">{this.getLabel(label)}</p>
        </div>
        <div className="col">
          <p>{value}</p>
        </div>
      </div>
    );
  };

  getLabel = (label) => {
    switch (label) {
      case "first_name": {
        return "First Name";
      }
      case "last_name": {
        return "Last Name";
      }
      case "middle_name": {
        return "Middle Name";
      }
      case "mobile": {
        return "Mobile";
      }
      case "landline": {
        return "Landline";
      }
      case "notes": {
        return "Notes";
      }
      case "createdAt": {
        return "Contact Created";
      }
      case "email": {
        return "Email";
      }
      case "view_count": {
        return "View Count";
      }
    }
  };

  formatDate = (date) => {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  };

  last7Days = () => {
    var result = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(this.formatDate(d));
    }
    return result;
  };

  render() {
    const loader = (
      <div className="loader-overlay">
        <div className="react-loader">
          <CircularProgress size={50} />
        </div>
      </div>
    );
    let columns = [];
    let detail = JSON.parse(JSON.stringify(this.state.detail));
    for (let ind = 0; ind < Object.keys(detail).length; ind += 2) {
      let div1 = null;
      let div2 = null;
      let combinedDiv = null;
      if (ind < Object.keys(detail).length) {
        div1 = this.getDetails(
          Object.keys(detail)[ind],
          detail[Object.keys(detail)[ind]]
        );
      }
      if (ind + 1 < Object.keys(detail).length) {
        div2 = this.getDetails(
          Object.keys(detail)[ind + 1],
          detail[Object.keys(detail)[ind + 1]]
        );
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
      <div className="contact-detail">
        {this.state.loading ? loader : null}
        <div className="graph-section">
          <Card>
            <div className="heading-section">
              <h6 style={{ width: "89%" }}>COUNT SUMMARY FOR LAST 7 DAYS</h6>
              <span
                className="show-section gr"
                onClick={() =>
                  this.setState({ showGraph: !this.state.showGraph })
                }
              >
                SHOW {this.state.showGraph ? "LESS" : "MORE"}
              </span>
            </div>
            <div className="graph">
              {this.state.graphData.length > 0 && this.state.showGraph ? (
                <ViewGraph data={this.state.graphData}></ViewGraph>
              ) : null}
            </div>
          </Card>
        </div>
        <div className="detail-section">
          <Card>
            <div className="heading-section">
              <h6 style={{ width: "89%" }}>DETAILS</h6>
              <span
                onClick={() =>
                  this.setState({ showDetails: !this.state.showDetails })
                }
                className="show-section det"
              >
                SHOW {this.state.showDetails ? "LESS" : "MORE"}
              </span>
            </div>
            {this.state.showDetails ? (
              <div className="row details">{columns}</div>
            ) : null}
          </Card>
        </div>
      </div>
    );
  }
}

export default ContactDetail;
