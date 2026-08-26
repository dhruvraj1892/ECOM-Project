import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";

const Product = () => {
  let isloggedIn = false;
  let isAdmin = false;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token != null) {
    isloggedIn = true;

    if (user?.role == "ADMIN")
      isAdmin = true;
  }

  const { id } = useParams();

  const {
    data,
    addToCart,
    removeFromCart,
    cart,
    refreshData
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await axios.get(
          `/api/product/${id}`
        );

        const data = response.data;

        setProduct(data);

        console.log(data);

        if (data.imageName) {
          fetchImage();
        }

      } catch (error) {

        console.error(
          "Error fetching product:",
          error
        );

      }
    };

    const fetchImage = async () => {

      try {

        const response = await axios.get(
          `/api/product/${id}/image`,
          {
            responseType: "blob"
          }
        );

        setImageUrl(
          URL.createObjectURL(response.data)
        );

      } catch (error) {

        console.error(
          "Error fetching product image:",
          error
        );

      }
    };

    fetchProduct();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };

  }, [id]);

  const deleteProduct = async () => {

    try {

      const response = await axios.delete(
        `/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Product deleted successfully"
      );

      removeFromCart(id);

      toast.success(
        "Product deleted successfully"
      );

      refreshData();

      navigate("/");

    } catch (error) {

      console.error(
        "Error deleting product:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      toast.error(
        error.response?.data ||
        "Failed to delete product"
      );
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {

    addToCart(product);

    toast.success(
      "Product added to cart"
    );
  };

  if (!product) {

    return (
      <div className="container mt-5 pt-5">

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >

          <div
            className="spinner-border text-primary"
            role="status"
          >

            <span className="visually-hidden">
              Loading...
            </span>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="container mt-5 pt-5">

      <div className="row">

        <div className="col-md-6 mb-4">

          <div className="card border-0">

            <img
              src={imageUrl}
              alt={product.name}
              className="card-img-top img-fluid"
              style={{
                maxHeight: "500px",
                objectFit: "contain"
              }}
            />

          </div>

        </div>

        <div className="col-md-6">

          <div className="d-flex justify-content-between align-items-center mb-2">

            <span className="badge bg-secondary">
              {product.category}
            </span>

            <small className="text-muted">
              Listed:{" "}
              {new Date(
                product.releaseDate
              ).toLocaleDateString()}
            </small>

          </div>

          <h2 className="text-capitalize mb-1">
            {product.name}
          </h2>

          <p className="text-muted fst-italic mb-4">
            ~ {product.brand}
          </p>

          <div className="mb-4">

            <h5 className="mb-2">
              Product Description:
            </h5>

            <p>
              {product.description}
            </p>

          </div>

          <h3 className="fw-bold mb-3">
            ₹ {product.price}
          </h3>

          {isloggedIn &&
            <div className="d-grid gap-2 mb-3">

              <button
                className="btn btn-primary btn-lg"
                onClick={handlAddToCart}
                disabled={
                  !product.productAvailable ||
                  product.stockQuantity === 0
                }
              >
                {product.stockQuantity !== 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

            </div>
          }

          <p className="mb-4">

            <span className="me-2">
              Stock Available:
            </span>

            <span className="fw-bold text-success">
              {product.stockQuantity}
            </span>

          </p>

          {isAdmin &&
            <div className="d-flex gap-2">

              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleEditClick}
              >

                <i className="bi bi-pencil me-1"></i>

                Update

              </button>

              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={deleteProduct}
              >

                <i className="bi bi-trash me-1"></i>

                Delete

              </button>

            </div>
          }

        </div>

      </div>

    </div>
  );
};

export default Product;