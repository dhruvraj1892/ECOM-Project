import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../utils/api";
import "./Navbar.css";

const Navbar = ({ onSelectCategory }) => {

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const handleLogout = (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      "Are you sure want to logout?"
    );

    if (!confirm) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log(
      "token is : " + localStorage.getItem("token")
    );

    console.log(localStorage.getItem("user"));

    navigate("/login");
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setIsNavCollapsed(true);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  useEffect(() => {

    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {

      try {

        const response = await apifetch(
          `/api/products/search?keyword=${encodeURIComponent(input)}`,
          {
            method: "GET"
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to search products"
          );
        }

        const data = await response.json();

        setSuggestions(data);

      } catch (error) {

        console.error(error);

      }

    }, 300);

    return () => clearTimeout(timer);

  }, [input]);

  const fetchInitialData = async () => {

    try {

      const response = await apifetch(
        "/api/products",
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      console.log(
        data,
        "navbar initial data"
      );

    } catch (error) {

      console.error(
        "Error fetching initial data:",
        error
      );

    }

  };

  const handleNavbarToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
  };

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);

    try {

      const response = await apifetch(
        `/api/products/search?keyword=${encodeURIComponent(input)}`,
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to search products"
        );
      }

      const data = await response.json();

      setSearchResults(data);

      if (data.length === 0) {

        setNoResults(true);
        setShowNoProductsMessage(true);

      } else {

        navigate(
          "/search-results",
          {
            state: {
              searchData: data
            }
          }
        );

      }

      console.log(
        "Search results:",
        data
      );

    } catch (error) {

      console.error(
        "Error searching:",
        error
      );

      setShowNoProductsMessage(true);

    } finally {

      setIsLoading(false);

    }

  };

  const handleCategorySelect = (category) => {

    setSelectedCategory(category);

    onSelectCategory(category);

    setIsNavCollapsed(true);

  };

  const toggleTheme = () => {

    const newTheme =
      theme === "dark-theme"
        ? "light-theme"
        : "dark-theme";

    setTheme(newTheme);

    localStorage.setItem(
      "theme",
      newTheme
    );

  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
    "Other"
  ];

  return (

    <nav
      className="navbar navbar-expand-lg fixed-top bg-white shadow-sm"
      ref={navbarRef}
    >

      <div className="container-fluid">

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >

          <span className="navbar-toggler-icon"></span>

        </button>

        <div
          className={`${
            isNavCollapsed ? "collapse" : ""
          } navbar-collapse`}
          id="navbarSupportedContent"
        >

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">

              <a
                className="nav-link active"
                aria-current="page"
                href="/"
                onClick={handleLinkClick}
              >
                Home
              </a>

            </li>

            {isAdmin && (

              <li className="nav-item">

                <a
                  className="nav-link"
                  href="/add_product"
                  onClick={handleLinkClick}
                >
                  Add Product
                </a>

              </li>

            )}

            <li className="nav-item">

              <a
                className="nav-link"
                href="/askai"
                onClick={handleLinkClick}
              >
                Ask AI
              </a>

            </li>
               {isLoggedIn && (

              <li className="nav-item">

                <a
                  className="nav-link"
                  href="/myOrders"
                  onClick={handleLinkClick}
                >
                  MyOrders
                </a>

              </li>

            )}
            {isAdmin && (

              <li className="nav-item">

                <a
                  className="nav-link"
                  href="/orders"
                  onClick={handleLinkClick}
                >
                  Orders
                </a>

              </li>

            )}

            {!isLoggedIn && (

              <li className="nav-item">

                  <a
                  className="nav-link"
                  href="/login"
                >
                 Login
                </a>

              </li>

            )}
         
            {isLoggedIn && (

              <li className="nav-item">

                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </li>

            )}
          </ul>

          <div className="d-flex align-items-center">

            {/* ONLY THIS IS CONDITIONAL */}

            {isLoggedIn && (

              <div className="welcome-user">
               Welcome {JSON.parse(localStorage.getItem("user")).name.split(" ")[0]} 
              </div>

            )}
            
            {isLoggedIn && (

              <a
                href="/cart"
                className="nav-link text-dark me-3"
                onClick={handleLinkClick}
              >
                <i className="bi bi-cart me-1"></i>
                Cart
              </a>

            )}

            <div className="position-relative">

              <form
                className="d-flex"
                role="search"
                onSubmit={handleSubmit}
                id="searchForm"
              >

                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="type to search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.value
                    )
                  }
                />

                {isLoading ? (

                  <button
                    className="btn btn-outline-success"
                    type="button"
                    disabled
                  >

                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>

                    <span className="visually-hidden">
                      Loading...
                    </span>

                  </button>

                ) : (

                  <button
                    className="btn btn-outline-success"
                    type="submit"
                  >
                    Search
                  </button>

                )}

              </form>

              {suggestions.length > 0 && (

                <div className="search-dropdown">

                  {suggestions
                    .slice(0, 5)
                    .map((product) => (

                      <div
                        key={product.id}
                        className="search-item"
                        onClick={() => {

                          navigate(
                            `/product/${product.id}`
                          );

                          setInput("");
                          setSuggestions([]);

                        }}
                      >
                        {product.name}
                      </div>

                    ))}

                </div>

              )}

            </div>

            {showNoProductsMessage && (

              <div
                className="alert alert-warning position-absolute mt-2"
                style={{
                  top: "100%",
                  zIndex: 1000
                }}
              >
                No products found matching your search.
              </div>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;