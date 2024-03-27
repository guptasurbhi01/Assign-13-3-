import React, { useState, useReducer } from "react";
import "./App.css"; 

const Products = [
  { id: 1, name: "Product-1", price: 100 },
  { id: 2, name: "Product-2", price: 200 },
  { id: 3, name: "Product-3", price: 300 },
];

const initialState = {
  cart: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const itemToAdd = Products.find(
        (product) => product.id === action.payload
      );
      return {
        ...state,
        cart: [...state.cart, { ...itemToAdd, quantity: 1 }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "INCREMENT_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREMENT_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    default:
      return state;
  }
}

const LeftBox = ({ addToCart, cart, incrementQuantity, decrementQuantity }) => {
  return (
    <div className="box">
      <h2>Available Products</h2>
      <ul>
        {Products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          return (
            <li key={product.id}>
              <button onClick={() => decrementQuantity(product.id)}>-</button>
              {quantity}
              <button onClick={() => incrementQuantity(product.id)}>+</button>
              {product.name} - ${product.price}
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const RightBox = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="box">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>No Product added to the cart</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price * item.quantity} - Quantity:{" "}
                {item.quantity}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total Price: ${totalPrice}</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = (productId) => {
    const isProductInCart = state.cart.some((item) => item.id === productId);

    if (!isProductInCart) {
      dispatch({ type: "ADD_TO_CART", payload: productId });
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const incrementQuantity = (productId) => {
    dispatch({ type: "INCREMENT_QUANTITY", payload: productId });
  };

  const decrementQuantity = (productId) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: productId });
  };

  return (
    <div className="container">
      <LeftBox
        addToCart={addToCart}
        cart={state.cart}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
      <RightBox cart={state.cart} removeFromCart={removeFromCart} />
    </div>
  );
};


export default App;
