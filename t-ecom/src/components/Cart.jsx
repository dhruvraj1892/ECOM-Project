import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import unplugged from "../assets/unplugged.png";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateStockQuantity
  } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    console.log("Cart", cart);

    if (cart && cart.length) {
      setCartItems(cart);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) =>
        acc + item.product.price * item.quantity,
      0
    );

    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = async (productId) => {
    const item = cartItems.find(
      (item) => item.product.id === productId
    );

    if (!item) return;

    if (item.quantity < item.product.stockQuantity) {
      try {
        await updateStockQuantity(
          productId,
          item.quantity + 1
        );
      } catch (error) {
        console.error(
          "Error increasing quantity:",
          error
        );

        toast.error("Failed to update quantity");
      }
    } else {
      toast.info(
        "Cannot add more than available stock"
      );
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const item = cartItems.find(
      (item) => item.product.id === productId
    );

    if (!item) return;

    if (item.quantity > 1) {
      try {
        await updateStockQuantity(
          productId,
          item.quantity - 1
        );
      } catch (error) {
        console.error(
          "Error decreasing quantity:",
          error
        );

        toast.error("Failed to update quantity");
      }
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);

      setCartItems(
        cartItems.filter(
          (item) => item.product.id !== productId
        )
      );

      toast.success("Product removed from cart");
    } catch (error) {
      console.error(
        "Error removing product:",
        error
      );

      toast.error("Failed to remove product");
    }
  };

  const convertBase64ToDataURL = (
    base64String,
    mimeType = "image/jpeg"
  ) => {
    if (!base64String) {
      return unplugged;
    }

    if (base64String.startsWith("data:")) {
      return base64String;
    }

    if (base64String.startsWith("http")) {
      return base64String;
    }

    return `data:${mimeType};base64,${base64String}`;
  };

  const handleCheckout=async()=>{
    try{
      const response=await axios.post("/api/orders/place");
      console.log("Order Placed "+ response.data);
      setCartItems([]);
      setShowModal(false);

    }
    catch(error){
      console.log("Error placing Order "+error);
    }
  };
  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h4 className="mb-0">
                Shopping Cart
              </h4>
            </div>

            <div className="card-body">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x fs-1 text-muted"></i>

                  <h5 className="mt-3">
                    Your cart is empty
                  </h5>

                  <a
                    href="/"
                    className="btn btn-primary mt-3"
                  >
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={convertBase64ToDataURL(
                                    item.product.imageData
                                  )}
                                  alt={item.product.name}
                                  className="rounded me-3"
                                  width="80"
                                  height="80"
                                  style={{
                                    objectFit: "cover"
                                  }}
                                  onError={(e) => {
                                    e.target.src =
                                      unplugged;
                                  }}
                                />

                                <div>
                                  <h6 className="mb-0">
                                    {item.product.name}
                                  </h6>

                                  <small className="text-muted">
                                    {item.product.brand}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td>
                              ₹ {item.product.price}
                            </td>

                            <td>
                              <div
                                className="input-group input-group-sm"
                                style={{
                                  width: "120px"
                                }}
                              >
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() =>
                                    handleDecreaseQuantity(
                                      item.product.id
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>

                                <input
                                  type="text"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  readOnly
                                />

                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() =>
                                    handleIncreaseQuantity(
                                      item.product.id
                                    )
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>

                            <td className="fw-bold">
                              ₹{" "}
                              {(
                                item.product.price *
                                item.quantity
                              ).toFixed(2)}
                            </td>

                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleRemoveFromCart(
                                    item.product.id
                                  )
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card mt-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          Total:
                        </h5>

                        <h5 className="mb-0">
                          ₹ {totalPrice.toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() =>
                        setShowModal(true)
                      }
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() =>
          setShowModal(false)
        }
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;