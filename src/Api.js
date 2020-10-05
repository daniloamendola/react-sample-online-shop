import axios from 'axios';
import { sampleProducts } from './Data';
import * as CONSTANTS from "./Redux/Constants";
import Axios from 'axios';
///
//
// Methods of this class are used to simulate calls to server.
//
class Api {

  fetchitems(url) {
    console.log(url);
    return axios.get(url);
  }

  fetchitemsAuthentic(url, user, pass) {
    console.log(url);
    return axios.get(url, {
      auth: {
        username: user,
        password: pass
      }
    });
  }

  postitems(url, data, user, pass){
    console.log(url);
    return axios.post(url, data, {
      auth: {
        username: user,
        password: pass
      }
    });
  }

  postOrders(url, data){
    console.log(url);
    console.log(data);
    if (typeof url !== 'undefined' && url.indexOf("index.php") !== -1) {
      return this.postitems(url + "" + CONSTANTS.ORDERS_URL, data, localStorage.getItem('username'), localStorage.getItem('password')).then(res => {
        return res.data;
      });
    }
  }

  getOrders(url){
    if (typeof url !== 'undefined' && url.indexOf("index.php") !== -1) {
      return this.fetchitemsAuthentic(url + "" + CONSTANTS.ORDERS_URL, localStorage.getItem('username'), localStorage.getItem('password')).then(res => {
        return res.data;
      });
    }
  }

  getItemUsingID(url, id) {
    console.log(url);
    if (typeof url !== 'undefined' && url.indexOf("index.php") !== -1) {
      return this.fetchitems(url + "" + CONSTANTS.PRODUCTS_URL).then(res => {
        let data = res.data.filter(x => x.id === parseInt(id, 10));
        return data.length === 0 ? null : data[0]
      });
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let res = sampleProducts.filter(x => x.id === parseInt(id, 10));
          resolve(res.length === 0 ? null : res[0]);
        }, 500);
      });
    }
  }

  updateItem(url, data, cb){
    Axios.post(url, data).then(res =>{
      console.log(res)
      cb(res.data)
    }).catch(error =>{
      console.log(error)
      cb(error.data)
    });
  }

  createItem(url, data, cb){
    Axios.post(url, data).then(res =>{
      cb(res.data)
    }).catch(error =>{
      cb(error.data)
    });
  }

  sortByPrice(data, sortval) {
    if (sortval !== "lh" && sortval !== "hl") return data;

    let items = [...data];

    if (sortval === "lh") {
      items.sort((a, b) => a.price - b.price);
    } else {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }

  deleteItem(url){
    console.log(url);
    return axios.delete(url);
  }

  removeProductImage(url, imageName, cb){
    axios.post(url, {
      name: imageName
    }).then(res => {
      cb(res.data)
    }).catch(err => {
      cb(err)
    })
  }

  uploadProductImages(url, formData, cb){
    axios.post(url,
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function (res) {
          console.log(res)
          cb(res.data)
          console.log('SUCCESS!!');
        }).catch(function (erro) {
          cb([])
          console.log('FAILURE!!');
        });
  }

  searchItems(url, {
    category = "popular",
    term = "",
    sortValue = "lh",
    itemsPerPage = 10,
    usePriceFilter = "false",
    minPrice = 0,
    maxPrice = 1000,
    page = 1
  }) {
    // Turn this into a boolean
    usePriceFilter = usePriceFilter === "true" && true;
    if (typeof url !== 'undefined' && url.indexOf("index.php") !== -1) {
      return this.fetchitems(url + "" + CONSTANTS.PRODUCTS_URL).then(res => {
        let data = res.data.filter(item => {
          if (
            usePriceFilter &&
            (item.price < minPrice || item.price > maxPrice)
          ) {
            return false;
          }

          if (category === "popular") {
            return item.popular;
          }

          if (category !== "All categories" && category !== item.category)
            return false;

          if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
            return false;

          return true;
        });
        let totalLength = data.length;

        data = this.sortByPrice(data, sortValue);

        data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return { data, totalLength };
      });
    } else {

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let data = sampleProducts.filter(item => {
            if (
              usePriceFilter &&
              (item.price < minPrice || item.price > maxPrice)
            ) {
              return false;
            }

            if (category === "popular") {
              return item.popular;
            }

            if (category !== "All categories" && category !== item.category)
              return false;

            if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
              return false;

            return true;
          });

          let totalLength = data.length;

          data = this.sortByPrice(data, sortValue);

          data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

          resolve({ data, totalLength });
        }, 500);
      });
    }
  }
}

export default new Api();
