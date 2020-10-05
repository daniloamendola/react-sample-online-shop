import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { showPaymentDialog, setCheckedOutItems } from "../../Redux/Actions";
import { withRouter } from "react-router-dom";
import PaymentRoundedIcon from "@material-ui/icons/PaymentRounded";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Api from "../../Api";

const mapStateToProps = state => {
  return { open: state.showPaymentDialog, items: state.cartItems};
};

class ConnectedPaymentDialog extends Component {
  state = {
    message: "requires a registered safaricom number"
  };
  render() {
    let baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
    let imageUrl = document.querySelector("meta[property='image-url']").getAttribute("content");
    let totalPrice = this.props.items.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);
    let username = localStorage.getItem('username');

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            this.props.dispatch(showPaymentDialog(false));
          }}
        >
          <AppBar position="static" style={{ backgroundColor: "#008000" }}>
            <Toolbar>
              <PaymentRoundedIcon
                fontSize="large"
                style={{ color: "white", marginRight: 20 }}
              />
              Lipa na MPESA
            </Toolbar>
          </AppBar>

          <div
            style={{
              maxHeight: 400,
              padding: 10,
              overflow: "auto"
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                          <img
                    src={imageUrl + "/lipanampesa.jpg"}
                    alt=""
                    width={200}
                    height={200}
                    style={{
                      border: "1px solid lightgray",
                      borderRadius: "5px",
                      objectFit: "cover"
                    }}
                  />
                  </TableCell>
                  <TableCell>
                  <span style={{fontSize: '14px', color: '#F5F5F5', alignItems: 'center'}}>{username}</span>
                    <h3 style={{alignItems: "center"}}>
                      Click on the PAY NOW button and a request will be sent to your phone. Confirm the popup to pay.
                    </h3>
                    <span style={{fontSize: '11px', color: '#008000'}}>{this.state.message}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div style={{ display: "flex", padding: 20, alignItems: "center" }}>
            <div
              style={{
                flex: 1
              }}
            >
              {" "}
              Total Price: {totalPrice} KES
            </div>
            <Button
              variant="outlined"
              color="primary"
              disabled={totalPrice === 0}
              onClick={() => {
                Api.postOrders(baseUrl, this.props.items).then(res => {
                  console.log(res)
                  this.props.dispatch(setCheckedOutItems([]));
                  this.props.dispatch(showPaymentDialog(false));
                  this.props.history.push("/order");
                }).catch(error => {
                  this.setState({message: error.getMessage()})
                  console.log(error)
                })
              }}
            >
              PAY NOW
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}
const PaymentDialog = withRouter(connect(mapStateToProps)(ConnectedPaymentDialog));
export default PaymentDialog;
