import React, { Component } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import * as Constants from "../../Constants"

class ConnectedForgotPassword extends Component {
    state = {
        message: "",
        email: "",
        redirectToReferrer: false,
        submit: false
    };
    render() {
        let baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const recaptchaRef = React.createRef();
        // If user was authenticated, redirect her to where she came from.
        if (this.state.redirectToReferrer === true) {
            return <Redirect to={from} />;
        }

        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",

                    alignItems: "center"
                }}
            >
                <div
                    style={{
                        width: 300,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}>
                    <Avatar style={{ marginBottom: 10 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <div
                        style={{
                            marginBottom: 20,
                            fontSize: 24,
                            textAlign: "center"
                        }}>
                        {" "} Enter email to send token {" "}
                    </div>
                    <TextField
                        value={this.state.userName}
                        placeholder="email"
                        onChange={e => {
                            this.setState({ email: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <Button
                        style={{ marginTop: 20, width: 300 }}
                        variant="outlined"
                        disabled={this.state.submit}
                        color="primary"
                        onClick={async () => {
                            this.setState({ message: "Validating..." });
                            Auth.forgotPassword(baseUrl, this.state.email, user => {
                                console.log(user.message);
                                this.setState(() => ({ status: user.status, message: user.message }));
                                if (user.status) {
                                    this.props.history.push("/reset-password");
                                }
                            });
                        }}>Send Token</Button>
                    {!this.state.status && (
                        <div style={{ color: "red" }}>{this.state.message} <Link to="/register" style={{fontSize: '15px',textDecoration: 'none'}}> Register now</Link></div>
                    )}
                </div>
            </div>
        );
    }
}
const ForgotPassword = withRouter(connect()(ConnectedForgotPassword));

export default ForgotPassword;
