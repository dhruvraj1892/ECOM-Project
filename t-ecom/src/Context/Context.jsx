import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {}
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(`/api/cart/add/${product.id}`);

      setCart((prevCart) => {
        const existing = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existing) {
          return prevCart.map((item) =>
            item.product.id === product.id ? response.data : item
          );
        }

        return [...prevCart, response.data];
      });
    } catch (error) {
      console.log("error adding to cart " + error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${productId}`);

      setCart((prevCart) =>
        prevCart.filter(
          (item) => item.product.id !== productId
        )
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/api/products");

      setData(response.data);
      setIsError("");
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart/clear");
      setCart([]);
    } catch (error) {
      console.log("error clearing cart " + error);
    }
  };

  const getCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateStockQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(`/api/cart/${productId}`, {
        quantity: newQuantity
      });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? response.data : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  useEffect(() => {
    refreshData();

    if (localStorage.getItem("token")) {
      getCart();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        updateStockQuantity,
        clearCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;