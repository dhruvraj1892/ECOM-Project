package com.telusko.SpringEcom.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.telusko.SpringEcom.model.dto.OrderResponse;
import com.telusko.SpringEcom.model.dto.PaymentVerificationRequest;
import com.telusko.SpringEcom.service.OrderService;
import com.telusko.SpringEcom.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {
  @Value("${razorpay.key.id}")
private String keyId;
    @Value("${razorpay.key.secret}")
  private String keySecret;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private OrderService orderService;
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount){
        try {

            RazorpayClient razorpayClient =
                    new RazorpayClient(keyId, keySecret);

            int amountInPaise = (int) (amount * 100);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "smartikart_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body("Error creating Razorpay order: " + e.getMessage());
        }
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request,
            Authentication authentication) {

        boolean verified = paymentService.verifyPayment(request);

        if (!verified) {
            return ResponseEntity
                    .badRequest()
                    .body("Payment verification failed");
        }

        String email = authentication.getName();

        OrderResponse orderResponse =
                orderService.placeOrder(email);

        System.out.println("Order Placed");

        return ResponseEntity.ok(orderResponse);
    }

};
