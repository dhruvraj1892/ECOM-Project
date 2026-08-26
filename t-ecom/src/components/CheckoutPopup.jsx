import React, { useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../utils/api";
import axios from "../axios";

const CheckoutPopup = ({
    show,
    handleClose,
    cartItems,
    totalPrice
}) => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [validated, setValidated] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async (event) => {

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        setIsSubmitting(true);

        try {

            const response = await apifetch(
                `/api/payment/create-order?amount=${totalPrice}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create Razorpay order"
                );
            }

            const razorpayOrder = await response.json();

            console.log(
                "Razorpay order:",
                razorpayOrder
            );

            const options = {

                key: import.meta.env.VITE_RAZORPAY_ID,

                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,

                name: "Smart I Kart",
                description: "Smart I Kart Purchase",

                order_id: razorpayOrder.id,

                prefill: {
                    name: name,
                    email: email
                },

                handler: async function (paymentResponse) {

                    console.log(
                        "Razorpay payment response:",
                        paymentResponse
                    );

                    try {

                        const verifyResponse =
                            await apifetch(
                                "/api/payment/verify",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        razorpayOrderId:
                                            paymentResponse
                                                .razorpay_order_id,

                                        razorpayPaymentId:
                                            paymentResponse
                                                .razorpay_payment_id,

                                        razorpaySignature:
                                            paymentResponse
                                                .razorpay_signature
                                    })
                                }
                            );

                        if (!verifyResponse.ok) {
                            throw new Error(
                                "Payment verification failed"
                            );
                        }

                        const verifyData =
                            await verifyResponse.json();

                        console.log(
                            "Payment verification response:",
                            verifyData
                        );

                      
                        setToastVariant("success");

                        setToastMessage(
                            "Payment successful! Order placed."
                        );

                        setShowToast(true);

                        localStorage.removeItem(
                            "cart"
                        );

                        setTimeout(() => {
                            navigate("/myOrders");
                        }, 2000);

                    } catch (error) {

                        console.error(
                            "Payment verification/order placement failed:",
                            error
                        );

                        setToastVariant("danger");

                        setToastMessage(
                            "Payment verification failed."
                        );

                        setShowToast(true);
                    }

                    setIsSubmitting(false);
                },

                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                    }
                }
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(
                "Error creating Razorpay order:",
                error
            );

            setToastVariant("danger");

            setToastMessage(
                "Unable to start payment."
            );

            setShowToast(true);

            setIsSubmitting(false);
        }
    };

    const convertBase64ToDataURL = (
        base64String,
        mimeType = "image/jpeg"
    ) => {

        if (!base64String) {
            return "";
        }

        if (base64String.startsWith("data:")) {
            return base64String;
        }

        if (base64String.startsWith("http")) {
            return base64String;
        }

        return `data:${mimeType};base64,${base64String}`;
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        Checkout
                    </Modal.Title>

                </Modal.Header>

                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleConfirm}
                >

                    <Modal.Body>

                        <div className="checkout-items mb-4">

                            {cartItems.map((item) => (

                                <div
                                    key={item.id}
                                    className="d-flex mb-3 border-bottom pb-3"
                                >

                                    <img
                                        src={convertBase64ToDataURL(
                                            item.product.imageData
                                        )}
                                        alt={item.product.name}
                                        className="me-3 rounded"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <div className="flex-grow-1">

                                        <h6 className="mb-1">
                                            {item.product.name}
                                        </h6>

                                        <p className="mb-1 small">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="mb-0 small">
                                            Price: ₹
                                            {(
                                                item.product.price *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>

                                    </div>

                                </div>

                            ))}

                            <div className="text-center my-4">

                                <h5 className="fw-bold">
                                    Total: ₹
                                    {totalPrice.toFixed(2)}
                                </h5>

                            </div>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Name
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                />

                                <Form.Control.Feedback type="invalid">
                                    Please provide your name.
                                </Form.Control.Feedback>

                            </Form.Group>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Email
                                </Form.Label>

                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email address.
                                </Form.Control.Feedback>

                            </Form.Group>

                        </div>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Close
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >

                            {isSubmitting ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                    Processing...
                                </>

                            ) : (
                                "Confirm Purchase"
                            )}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>

            <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 1070 }}
            >

                <Toast
                    show={showToast}
                    onClose={() =>
                        setShowToast(false)
                    }
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >

                    <Toast.Header closeButton>

                        <strong className="me-auto">
                            Order Status
                        </strong>

                    </Toast.Header>

                    <Toast.Body
                        className={
                            toastVariant === "success"
                                ? "text-white"
                                : ""
                        }
                    >
                        {toastMessage}
                    </Toast.Body>

                </Toast>

            </ToastContainer>
        </>
    );
};

export default CheckoutPopup;