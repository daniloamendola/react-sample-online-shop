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
import * as Constants from "../../Constants"

class ConnectedLogin extends Component {
  state = {
    userName: "",
    pass: "",
    redirectToReferrer: false,
    submit:false
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
            width: 300 ,
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
            {" "}
            Log in{" "}
          </div>
          <TextField
            value={this.state.userName}
            placeholder="phone number"
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
              // Simulate authentication call
              // const token = await recaptchaRef.current.executeAsync();
              // console.log(token)
              // this.setState(() => ({
              //   submit: true
              // }));
              Auth.authenticate(baseUrl, this.state.userName, this.state.pass, user => {
                if (!user) {
                  this.setState({ wrongCred: true });
                  return;
                }
                localStorage.setItem("username", this.state.userName);
                localStorage.setItem("password", this.state.pass);
                localStorage.setItem("is_admin", user.user_level);
                this.props.dispatch(setLoggedInUser({ name: user.name }));
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              });
            }}
          >
            Log in
          </Button>
          <Link to="/forgot-password" style={{ textDecoration: 'none', float: 'right' }}>Forgot password</Link>
          <Button
            style={{ marginTop: 20, width: 300 }}
            onClick={
              () => {
                this.props.history.push("/register");
              }
            }>
            Create Account
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong phonenumber and/or password</div>
          )}
        </div>
      </div>
    );
  }
}
const Login = withRouter(connect()(ConnectedLogin));

export default Login;
