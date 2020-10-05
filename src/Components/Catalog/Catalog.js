import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import Api from "../../Api";
import Paging from "../Paging/Paging";
import ProductsHeader from "../ProductsHeader/ProductsHeader";
import CatalogItem from "./CatalogItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as Constants from "../../Redux/Constants";
import { toggleMenu } from "../../Redux/Actions";
import Button from "@material-ui/core/Button";

// This component is responsible for fetching products.
// It determines from query string which products to fetch.
// The URL is checked on initial mount and when URL changes.
class Catalog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            totalItemsCount: null,
            items: []
        };
        this.updateQueryStr = this.updateQueryStr.bind(this);
    }

    async fetchData(url) {
        this.setState({ loading: true });

        // Parse the query string
        let qsAsObject = queryString.parse(this.props.location.search);
        let results;
        await Api.searchItems(url, qsAsObject).then(data => {
            console.log(data);
            results = data;
        });

        this.setState({
            items: results.data,
            loading: false,
            totalItemsCount: results.totalLength
        });
    }
    imageUrl = "";

    async deleteProduct(id) {
        let baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
        await Api.deleteItem(baseUrl + Constants.PRODUCTS_URL + "/" + id).then(res => {
            alert(res.data);
        });
    }

    componentDidMount() {
        let baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
        this.imageUrl = document.querySelector("meta[property='image-url']").getAttribute("content");
        this.fetchData(baseUrl);
    }

    updateQueryStr(newValues) {
        let current = queryString.parse(this.props.location.search);
        this.props.history.push(
            "/?" + queryString.stringify({ ...current, ...newValues })
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let currentQueryStr = queryString.parse(this.props.location.search);
        let oldQueryStr = queryString.parse(prevProps.location.search);

        let areSameObjects = (a, b) => {
            if (Object.keys(a).length !== Object.keys(b).length) return false;
            for (let key in a) {
                if (a[key] !== b[key]) return false;
            }
            return true;
        };

        // We will refetch products only when query string changes.
        if (!areSameObjects(currentQueryStr, oldQueryStr)) {
            this.fetchData();
        }
    }

    render() {
        let parsedQueryStr = queryString.parse(this.props.location.search);

        if (this.state.loading) {
            return <CircularProgress className="circular" />;
        }

        return (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Button
                                style={{ width: 170, marginTop: 5 }}
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (this.props.showMenu)
                                        this.props.dispatch(toggleMenu());
                                    this.props.history.push("/manage-catalog-add");
                                }}
                            >
                                Add Product
                        </Button></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Item image</TableCell>
                            <TableCell>Item name</TableCell>
                            <TableCell>Item description</TableCell>
                            <TableCell>Item category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {this.state.items.map(item => {
                            return <CatalogItem key={item.id} item={item} deleteItem={this.deleteProduct} path={this.imageUrl} />;
                        })}

                    </TableBody>
                </Table>
                <Paging
                    parsedQueryStr={parsedQueryStr}
                    updateQueryStr={this.updateQueryStr}
                    totalItemsCount={this.state.totalItemsCount}
                />
            </div>
        );
    }
}

export default Catalog;
