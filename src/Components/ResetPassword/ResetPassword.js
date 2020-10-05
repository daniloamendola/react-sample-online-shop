import React, { Component } from "react";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ReCAPTCHA from "react-google-recaptcha";
import * as Constants from "../../Constants";

class ConnectedResetPassword extends Component {
    state = {
        message: "Validating",
        token: "",
        password: "",
        confimPassword: "",
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
                    }}
                >
                    <Avatar style={{ marginBottom: 10 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <div
                        style={{
                            marginBottom: 20,
                            fontSize: 24,
                            textAlign: "center"
                        }}
                    >
                        {" "}Reset Password{" "}
                    </div>
                    <TextField
                        value={this.state.userName}
                        type="text"
                        placeholder="Token"
                        onChange={e => {
                            this.setState({ token: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.userName}
                        type="password"
                        placeholder="New passord"
                        onChange={e => {
                            this.setState({ password: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.pass}
                        type="password"
                        placeholder="Confirm New Password"
                        onChange={e => {
                            this.setState({ confimPassword: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={Constants.RECAPTCHA_KEY}
                    />
                    <Button
                        style={{ marginTop: 20, width: 300 }}
                        variant="outlined"
                        disabled={this.state.submit}
                        color="primary"
                        onClick={async () => {
                            Auth.resetPassword(baseUrl, this.state.token, this.state.password, user => {
                                this.setState(() => ({ status: user.status, message: user.message }));
                                if (user.status) {
                                    this.props.history.push("/login");
                                }
                            });
                        }}
                    > Reset Password</Button>
                    {!this.state.status && (
                        <div style={{ color: "red", fontSize: "15px" }}>{this.state.message} <Link to="/forgot-password" style={{ textDecoration: 'none' }}>Resend Token</Link></div>
                    )}
                </div>
            </div>
        );
    }
}
const ResetPassword = withRouter(connect()(ConnectedResetPassword));

export default ResetPassword;
