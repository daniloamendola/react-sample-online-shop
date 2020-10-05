import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import * as Constants from "../../Redux/Constants";
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { toggleMenu } from "../../Redux/Actions";

class ConnectedCatalogEdit extends Component {
    constructor(props) {
        super(props);

        this.isCompMounted = false;

        this.state = {
            quantity: 1,
            item: null,
            itemLoading: false,
            name: "",
            description: "",
            imageUrl: "",
            category: 1,
            price: 0.0,
            popular: 0,
            uploading: false,
            images: []
        };
    }
    imageUrl = "";
    baseUrl = "";

    async fetchProductAndRelatedItems(url, productId) {
        this.setState({ itemLoading: true });
        let item;
        await Api.getItemUsingID(url, productId).then(data => {
            item = data;
        });

        // Make sure this component is still mounted before we set state..
        if (this.isCompMounted) {
            this.setState({
                item,
                quantity: 1,
                itemLoading: false,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrls[0],
                category: item.category,
                price: item.price,
                popular: item.popular,
                uploading: false,
                images: item.imageUrls
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If ID of product changed in URL, refetch details for that product
        if (this.props.match.params.id !== prevProps.match.params.id) {
            let baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
            this.fetchProductAndRelatedItems(baseUrl, this.props.match.params.id);
        }
    }

    componentDidMount() {
        this.isCompMounted = true;
        this.imageUrl = document.querySelector("meta[property='image-url']").getAttribute("content");
        this.baseUrl = document.querySelector("meta[property='base-url']").getAttribute("content");
        this.fetchProductAndRelatedItems(this.baseUrl, this.props.match.params.id);
    }

    componentWillUnmount() {
        this.isCompMounted = false;
    }

    onChange = e => {
        const files = Array.from(e.target.files)
        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            formData.append(i, file)
        })

        Api.uploadProductImages(this.baseUrl + Constants.PRODUCTS_IMAGE_URL, formData, images => {
            this.setState({
                uploading: false,
                images: images.data
            })
        });
    }

    removeImage = id => {
        Api.removeProductImage(this.baseUrl+Constants.PRODUCT_IMAGE_REMOVE_URL, this.state.images[id], res => {
            alert(res);
            this.setState({
                images: this.state.images.filter((image, index) => index !== id)
            });
        })
    }

    handleProductCreate = () => {
        Api.updateItem(this.baseUrl + Constants.PRODUCTS_UPDATE_URL + "?id=" + this.state.item.id, {
            name: this.state.name,
            category: this.state.category,
            price: this.state.price,
            description: this.state.description,
            popular: this.state.popular,
            images: this.state.images
        }, message => {
            alert(message);
            if (this.props.showMenu)
                this.props.dispatch(toggleMenu());
            this.props.history.push("/manage-catalog");
        });
    }

    handleListItemClick = (event, index) => {
        this.setState({ imageUrl: this.state.images[index] })
    };

    render() {
        if (this.state.itemLoading) {
            return <CircularProgress className="circular" />;
        }

        if (!this.state.item) {
            return null;
        }

        return (
            <div style={{ padding: 10 }}>
                <div style={{
                    display: "flex",
                    marginTop: 10
                }}>

                    <div
                        style={{
                            flex: 1,
                            marginLeft: 20,
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <div
                            style={{
                                marginBottom: 20,
                                marginTop: 10,
                                fontSize: 22
                            }}
                        >
                            Update product: {this.state.item.name}
                        </div>
                        <img
                            src={this.imageUrl + this.state.imageUrl}
                            alt=""
                            width={250}
                            height={250}
                            style={{
                                border: "1px solid lightgray",
                                borderRadius: "5px",
                                objectFit: "cover"
                            }}
                        />
                        <input type='file' name='product_image' onChange={this.onChange} multiple />

                        <List dense={true}>
                            {this.state.images.map((item, index) => {
                                return <ListItem key={index}
                                    onClick={(event) => this.handleListItemClick(event, 0)}>
                                    <ListItemText
                                        primary={item}
                                        secondary={index + 1}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                            this.removeImage(index)
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            })}
                        </List>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            marginLeft: 20,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <TextField
                            value={this.state.name}
                            label="Product Name"
                            onChange={e => {
                                this.setState({ name: e.target.value });
                            }}
                            style={{
                                marginBottom: 20,
                                width: "100%"
                            }}
                        />
                        <TextField
                            value={this.state.price}
                            label="Product price"
                            type="number"
                            onChange={e => {
                                this.setState({ price: e.target.value });
                            }}
                            style={{
                                marginBottom: 20,
                                width: "100%"
                            }}
                        />
                        <FormControlLabel
                            value="popular"
                            control={<Checkbox
                                checked={this.state.popular}
                                color="primary"
                                onChange={(cb) => {
                                    this.setState({ popular: cb.target.checked })
                                }}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />}
                            label="Popular product"
                            labelPlacement="start"
                        />
                        <TextField
                            type="number"
                            value={this.state.quantity}
                            style={{ marginTop: 20, marginBottom: 10, width: 70 }}
                            label="Quantity"
                            inputProps={{ min: 1, max: 10, step: 1 }}
                            onChange={e => {
                                this.setState({ quantity: parseInt(e.target.value) });
                            }}
                        />
                        <FormControl variant="outlined" >
                            <Select
                                id="category"
                                value={this.state.category}
                                onChange={(event) => {
                                    this.setState({ category: event.target.value })
                                }}
                                label="Category"
                            >
                                <MenuItem value="">
                                    <em>Select category</em>
                                </MenuItem>
                                <MenuItem value={1}>Jewellery and Watches</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div
                    style={{
                        flex: 1,
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "column"
                    }}>
                    <TextField
                        value={this.state.description}
                        label="Product Description"
                        id="outlined-multiline-static"
                        multiline
                        rows="10"
                        variant="outlined"
                        onChange={e => {
                            this.setState({ description: e.target.value });
                        }}
                    />
                    <Button
                        style={{ width: 170, marginTop: 5 }}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            this.handleProductCreate();
                        }}
                    >
                        Save
                        </Button>
                </div>
            </div>
        );
    }
}

let CatalogEdit = connect()(ConnectedCatalogEdit);
export default CatalogEdit;
