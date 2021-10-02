import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

import "./Form.css"

class Form extends Component {
    state = {
        defaultFields: [],
        fields: null,
        popoverAnchorEl: null,
        generalAnchorEl: null,
        changeOrderField: null,
        orderNo: null,
        loading: false,
        error: null
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get("https://localhost:44357/api/formconfigurator").then(res => {
            this.setState({ defaultFields: res.data, loading: false })
        }).catch(err => {
            console.log("ERROR")
            console.log(err)
            this.setState({ error: "Something went wrong!", loading: false })
        })
    }

    changeStatus = (fieldName) => {
        let stateCopy = JSON.parse(JSON.stringify(this.state.defaultFields))
        let updatedStateCopy = stateCopy.map(obj => {
            if (obj.fieldName == fieldName) {
                obj.status = obj.status == "show" ? "hidden" : "show"
            }
            return obj
        })
        this.setState({ defaultFields: updatedStateCopy })
    }

    showChangeOrderPopup = (fieldName) => {
        this.setState({ popoverAnchorEl: "Show Popup", changeOrderField: fieldName })
    }

    closeChangeOrderPopover = () => {
        this.setState({ popoverAnchorEl: null, orderNo: null, changeOrderField: null })
    }

    changeOrder = () => {
        if (this.state.orderNo > this.state.defaultFields.length) {
            this.setState({
                popoverAnchorEl: null,
                generalAnchorEl: "Order No cannot be greater than " + this.state.defaultFields.length,
                orderNo: null
            })
        } else {
            let stateCopy = JSON.parse(JSON.stringify(this.state.defaultFields))
            let oldOrderNo = null
            let updatedCopy = stateCopy.map(obj => {
                if (obj.fieldName == this.state.changeOrderField) {
                    oldOrderNo = obj.order
                    obj.order = parseInt(this.state.orderNo)
                }

                return obj
            })
            let finalUpdatedCopy = updatedCopy.map(obj => {
                if (obj.order == parseInt(this.state.orderNo) && obj.fieldName != this.state.changeOrderField) {
                    obj.order = oldOrderNo
                }
                return obj
            })
            this.setState({ defaultFields: finalUpdatedCopy, orderNo: null, changeOrderField: null, popoverAnchorEl: null })
        }
    }

    submit = () => {
        this.setState({ loading: true })
        axios.post("https://localhost:44357/api/formconfigurator", this.state.defaultFields).then(resp => {
            this.setState({ loading: false, generalAnchorEl: "Configuration saved successfully." })
        }).catch(err => {
            console.log("Error!!")
            console.log(err)
            this.setState({ error: "Something went wrong!", loading: false })
        });
    }

    render() {
        const open = Boolean(this.state.popoverAnchorEl);
        const generalOpen = Boolean(this.state.generalAnchorEl)
        const loader = this.state.loading ? (
            <div className="loader-overlay">
                <div className="react-loader">
                    <CircularProgress
                        size={50}
                    />
                </div>
            </div>
        ) : null
        const popover = (
            <Popover
                open={open}
                anchorEl={this.state.popoverAnchorEl}
                onClose={this.closeChangeOrderPopover}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <div className="change-order-section">
                    <CloseIcon onClick={this.closeChangeOrderPopover} className="close-icon" />
                    <TextField label="Order Number"
                        InputProps={{ inputProps: { min: 0, max: this.state.defaultFields.length } }}
                        type="number" value={this.state.orderNo}
                        onChange={(event) => this.setState({ orderNo: event.target.value })}>
                    </TextField>
                    <div style={{ width: 'fit-content', margin: '0 auto', marginTop: '30px' }}>
                        <Button className="change-order-button" onClick={this.changeOrder}>Change</Button>
                    </div>
                </div>
            </Popover >
        )
        const generalPopover = (
            <Popover
                open={generalOpen}
                anchorEl={this.state.generalAnchorEl}
                onClose={() => this.setState({ generalAnchorEl: null })}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                className="general-popover"
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <div>
                    <CloseIcon onClick={() => this.setState({ generalAnchorEl: null })} className="close-icon" />
                    <div className="info-msg">
                        {this.state.generalAnchorEl}
                    </div>
                </div>
            </Popover >
        )
        let fields = []
        for (let ind = 1; ind <= this.state.defaultFields.length; ind++) {
            for (let field of this.state.defaultFields) {
                if (field.order == ind) {
                    let fieldEntry = (
                        <div className="single-form-field row">
                            <div className="col-7">
                                <p>{field.fieldName}</p>
                                {
                                    field.status == "show" ? <TextField label={field.fieldName} type="text"></TextField> : null
                                }
                            </div>
                            <div className="action-section col-4">
                                <span className="links" onClick={() => this.changeStatus(field.fieldName)}>
                                    <Button variant="contained">{field.status == "show" ? "Hide Field" : "Show Field"}</Button>
                                </span>

                                <span style={{ marginLeft: '150px' }}>
                                    <Button onClick={() => this.showChangeOrderPopup(field.fieldName)} variant="contained">Change Order</Button>
                                </span>
                            </div>
                        </div>

                    )
                    fields.push(fieldEntry)
                }
            }
        }
        return (
            <div className="form-data">
                <Card>
                    <CardContent>
                        {
                            this.state.error ? <h1 style={{ textAlign: 'center' }}>Something went wrong!</h1> : <div className="entire-form">
                                {fields}
                                {popover}
                                {generalPopover}
                                {loader}
                                <div className="submit">
                                    <Button className="submit-btn" onClick={this.submit}>Submit Configuration</Button>
                                </div>
                            </div>
                        }
                    </CardContent>
                </Card>
            </div>
        )

    }

}

export default Form