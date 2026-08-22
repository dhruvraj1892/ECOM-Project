package com.telusko.SpringEcom.model.dto;


public record PaymentVerificationRequest (
    String razorpayOrderId,
    String razorpayPaymentId,
    String razorpaySignature,
    OrderRequest orderRequest
)
{}
