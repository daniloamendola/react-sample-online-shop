import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header/Header.js";
import ProductList from "./Components/ProductList/ProductList";
import { Switch, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import CartDialog from "./Components/CartDialog/CartDialog";
import PaymentDialog from "./Components/PaymentDialog/PaymentDialog";
import Details from "./Components/Details/Details";
import Order from "./Components/Order/Order";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Catalog from "./Components/Catalog/Catalog";
import CatalogAdd from "./Components/Catalog/CatalogAdd";
import CatalogEdit from "./Components/Catalog/CatalogEdit";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Menu />
          <div className="content">
            <CartDialog />
            <PaymentDialog />
            <Switch>
              <Route path="/" exact component={ProductList} />
              <Route path="/details/:id" component={Details} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <ProtectedRoute path="/order" component={Order} />
              <ProtectedRoute path="/manage-catalog" component={Catalog} />
              <ProtectedRoute path="/manage-catalog-add" component={CatalogAdd} />
              <ProtectedRoute path="/manage-catalog-edit/:id" component={CatalogEdit} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
