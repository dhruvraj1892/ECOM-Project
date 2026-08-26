import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import AskAi from "./components/AskAI";
import SearchResults from "./components/SearchResults";
import Order from "./components/Order";
import MyOrder from "./components/MyOrders";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import Login from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoutes";
import Register from "./components/Register";
import OAuth2Success from "./components/Oauth2Success";

function Layout({ onSelectCategory }) {
    return (
        <>
            <Navbar onSelectCategory={onSelectCategory} />

            <div className="min-vh-100 bg-light">
                <Outlet />
            </div>
        </>
    );
}

function App() {
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        console.log("Selected category:", category);
    };

    return (
        <AppProvider>
            <BrowserRouter>

                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={true}
                />

                <Routes>

                    {/* Login has NO Navbar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth2/success" element={<OAuth2Success />} />
                    {/* All these pages have Navbar */}
                    <Route
                        element={
                            <Layout
                                onSelectCategory={handleCategorySelect}
                            />
                        }
                    >
                        <Route
                            path="/"
                            element={
                                <Home
                                    selectedCategory={selectedCategory}
                                />
                            }
                        />

                        <Route
                            path="/add_product"
                            element={<AdminRoute><AddProduct /></AdminRoute>}
                        />

                        <Route
                            path="/product"
                            element={<Product />}
                        />

                        <Route
                            path="/product/:id"
                            element={<Product />}
                        />

                        <Route
                            path="/cart"
                            element={<ProtectedRoute><Cart/></ProtectedRoute>}
                        />

                        <Route
                            path="/product/update/:id"
                            element={<AdminRoute><UpdateProduct/></AdminRoute>}
                        />

                        <Route
                            path="/askai"
                            element={<ProtectedRoute><AskAi /></ProtectedRoute>}
                        />

                        <Route
                            path="/search-results"
                            element={<ProtectedRoute><SearchResults /></ProtectedRoute>}
                        />

                        <Route
                            path="/orders"
                            element={<AdminRoute><Order /></AdminRoute>}
                        />
                   
                        <Route
                            path="/myOrders"
                            element={<ProtectedRoute><MyOrder/></ProtectedRoute>}
                        />
                    </Route>
                </Routes>

            </BrowserRouter>
        </AppProvider>
    );
}

export default App;