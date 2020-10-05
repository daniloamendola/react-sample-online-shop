import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
    editCatalogItem,
    deleteCatalogtem
} from "../../Redux/Actions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
const truncate = function (str) {
    return str.length > 10 ? str.substring(0, 100) + "..." : str;
}
const CatalogItem = props => {
    let { item } = props;

    return (
        <TableRow>
            <TableCell style={{ width: '20%' }}><img
                src={props.path+item.imageUrls[0]}
                alt=""
                width={100}
                height={100}
                style={{
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                    objectFit: "cover"
                }}
            /></TableCell>
            <TableCell style={{ width: "15%" }}>{item.name}</TableCell>
            <TableCell style={{ width: "10%" }}>{item.category}</TableCell>
            <TableCell style={{ width: "30%" }}>{truncate(item.description)}</TableCell>
            <TableCell style={{ width: "10%" }}>{item.price}</TableCell>
            <TableCell style={{ width: "10%" }}>
                <TextField
                    type="number"
                    style={{ width: 40 }}
                    value={item.quantity}
                    onChange={e => {
                        let quantity = parseInt(e.target.value, 10);
                        if (quantity < 0) return;
                    }}
                />
            </TableCell>
            <TableCell style={{ width: "10%" }}>
                <Button color="primary" component={Link} to={`/manage-catalog-edit/${item.id}`} variant="contained" color="primary">
                    Edit
                </Button>
                <Button
                    color="secondary"
                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) props.deleteItem(item.id) }}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default CatalogItem;
