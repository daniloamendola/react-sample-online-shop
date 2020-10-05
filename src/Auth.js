// Simulate authentication service
import axios from 'axios';
import * as Constants from "./Redux/Constants";
import http from 'http';
import { resolveMx } from 'dns';
const Auth = {
  _isAuthenticated: false,

  authenticate(url, name, pass, cb) {
    this._isAuthenticated = true;
    const axiosInstance = axios.create({
      httpAgent: new http.Agent({
        rejectUnauthorized: false
      })
    })
    axiosInstance.post(url + Constants.USER_LOGIN, { name: name }, {
      auth: {
        username: name,
        password: pass
      }
    }).then(res => {
      console.log(res);
      console.log('Authenticated');
      cb(res.data)
    }).catch(error => {
      console.log('Error on Authentication');
      console.log(error);
      cb(false)
    });
  },

  signout(cb) {

    this._isAuthenticated = false;
    localStorage.setItem("username", null);
    localStorage.setItem("password", null);
    localStorage.setItem("is_admin", null);
    setTimeout(cb, 100);
  },

  register(url, first, last, phone, email, pass, cb) {
    axios.post(url + Constants.USER_REGISTER, {
      first_name: first,
      last_name: last,
      phone: phone,
      email: email,
      password: pass
    }).then(res => {
      cb({
        registered: true
      })
    }).catch(error => {
      console.log(error);
      cb({
        registered: false
      })
    });
  },

  resetPassword(url, token, newPassword, cb) {
    axios.post(url + Constants.USER_RESET_PASSWORD, {
      token: token,
      new_password: newPassword
    }).then(res => {
      console.log(res.data)
      cb(res.data)
    }).catch(error => {
      cb({
        status: false,
        message: "failed"
      })
    });
  },

  forgotPassword(url, email, cb) {
    axios.post(url + Constants.USER_FORGOT_PASSWORD, {
      email: email
    }).then(res => {
      console.log(res.data)
      cb(res.data)
    }).catch(error => {
      cb({
        status: false,
        message: "failed"
      })
    });
  }
};

export default Auth;
