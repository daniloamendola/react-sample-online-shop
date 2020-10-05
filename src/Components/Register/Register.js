import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import ReCAPTCHA from "react-google-recaptcha";
import * as Constants from "../../Constants"

class ConnectedRegister extends Component {
    state = {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        pass: "",
        repass: "",
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
                        width: 400,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                >
                    <Avatar style={{ marginBottom: 10 }}>
                        <PersonOutlinedIcon />
                    </Avatar>
                    <div
                        style={{
                            marginBottom: 20,
                            fontSize: 24,
                            textAlign: "center"
                        }}
                    >
                        {" "}
            Register{" "}
                    </div>
                    <TextField
                        value={this.state.firstName}
                        placeholder="First Name"
                        onChange={e => {
                            this.setState({ firstName: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.lastName}
                        placeholder="Last Name"
                        onChange={e => {
                            this.setState({ lastName: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.email}
                        placeholder="email"
                        type="email"
                        onChange={e => {
                            this.setState({ email: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.userName}
                        placeholder="phone number"
                        type="number"
                        onChange={e => {
                            this.setState({ userName: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.pass}
                        type="password"
                        placeholder="Password"
                        onChange={e => {
                            this.setState({ pass: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <TextField
                        value={this.state.repass}
                        type="password"
                        placeholder="Confirm Password"
                        onChange={e => {
                            this.setState({ repass: e.target.value });
                        }}
                        style={{
                            marginBottom: 20,
                            width: "100%"
                        }}
                    />
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={Constants.RECAPTCHA_KEY}
                        onChange={value => {
                            console.log(value)
                        }}
                    />
                    {this.state.registered && (
                        <div style={{ color: "red" }}>Please try again, to Register</div>
                    )}
                    <Button
                        style={{ marginTop: 20, width: 200 }}
                        variant="outlined"
                        disabled={this.state.submit}
                        color="primary"
                        onClick={async () => {
                            //const token = await recaptchaRef.current.executeAsync();
                            //console.log(token)
                            this.setState(() => ({
                                submit: false
                            }));
                            Auth.register(baseUrl, this.state.firstName, this.state.lastName, this.state.userName,  this.state.email, this.state.pass, response => {
                                if (!response) {
                                    this.setState({ registered: true });
                                    return;
                                }

                                // Redirect to login to authenticate user after register
                                this.props.history.push("/login");
                            });
                        }}
                    >
                        Register
          </Button>
                    <Button
                     style={{ marginTop: 20, width: 200 }}
                        onClick={
                            () => {
                                this.props.history.push("/login");
                            }
                        }>
                        Login
          </Button>

                </div>
            </div>
        );
    }
}
const Register = withRouter(connect()(ConnectedRegister));

export default Register;
