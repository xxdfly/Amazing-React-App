import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover from '../uielements/popover';
import SingleCart from '../cart/singleCartModal';
import ecommerceAction from '../../redux/ecommerce/actions';

const { changeViewTopbarCart, changeProductQuantity } = ecommerceAction;
let totalPrice;
class TopbarAddtoCart extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.renderProducts = this.renderProducts.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.cancelQuantity = this.cancelQuantity.bind(this);
  }
  hide() {
    this.props.changeViewTopbarCart(false);
  }
  handleVisibleChange() {
    this.props.changeViewTopbarCart(!this.props.viewTopbarCart);
  }
  renderProducts() {
    const { productQuantity, products } = this.props;
    totalPrice = 0;
    if (!productQuantity || productQuantity.length === 0) {
      return (
        <div className="isoNoItemMsg">
          <span>No item found</span>
        </div>
      );
    }
    return productQuantity.map(product => {
      totalPrice += product.quantity * products[product.objectID].price;
      return (
        <SingleCart
          key={product.objectID}
          quantity={product.quantity}
          changeQuantity={this.changeQuantity}
          cancelQuantity={this.cancelQuantity}
          {...products[product.objectID]}
        />
      );
    });
  }
  changeQuantity(objectID, quantity) {
    const { productQuantity } = this.props;
    const newProductQuantity = [];
    productQuantity.forEach(product => {
      if (product.objectID !== objectID) {
        newProductQuantity.push(product);
      } else {
        newProductQuantity.push({
          objectID,
          quantity
        });
      }
    });
    this.props.changeProductQuantity(newProductQuantity);
  }
  cancelQuantity(objectID) {
    const { productQuantity } = this.props;
    const newProductQuantity = [];
    productQuantity.forEach(product => {
      if (product.objectID !== objectID) {
        newProductQuantity.push(product);
      }
    });
    this.props.changeProductQuantity(newProductQuantity);
  }

  render() {
    const { url, productQuantity, viewTopbarCart } = this.props;
    const content = (
      <div className="isoDropdownContent">
        <div className="isoDropdownHeader">
          <h3>Cart</h3>
        </div>
        <div className="isoDropdownBody isoCartItemsWrapper">
          {this.renderProducts()}
        </div>
        <div className="isoDropdownFooterLinks">
          <Link to={`${url}/cart`} onClick={this.hide}>
            View Cart
          </Link>

          <h3>
            Total Price: <span>${totalPrice.toFixed(2)}</span>
          </h3>
        </div>
      </div>
    );
    return (
      <Popover
        content={content}
        trigger="click"
        visible={viewTopbarCart}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName="topbarAddtoCart"
      >
        <div className="isoIconWrapper">
          <i className="ion-android-cart" />
          {productQuantity.length === 0
            ? ''
            : <span>
                {productQuantity.length}
              </span>}
        </div>
      </Popover>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.Ecommerce.toJS()
  };
}
export default connect(mapStateToProps, {
  changeViewTopbarCart,
  changeProductQuantity
})(TopbarAddtoCart);
