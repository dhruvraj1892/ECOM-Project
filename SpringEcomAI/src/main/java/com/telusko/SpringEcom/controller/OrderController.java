package com.telusko.SpringEcom.controller;

import com.telusko.SpringEcom.model.CartItem;
import com.telusko.SpringEcom.model.dto.OrderRequest;
import com.telusko.SpringEcom.model.dto.OrderResponse;
import com.telusko.SpringEcom.repo.CartItemRepo;
import com.telusko.SpringEcom.repo.UserRepo;
import com.telusko.SpringEcom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> placeOrder(Authentication authentication) {
        String email=authentication.getName();
        OrderResponse orderResponse = orderService.placeOrder(email);

        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orderResponseList = orderService.getAllOrderResponses();
        return new ResponseEntity<>(orderResponseList, HttpStatus.OK);
    }
    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication){
        String email=authentication.getName();
        List<OrderResponse> orders=orderService.getMyOrders(email);
        return new ResponseEntity<>(
                orders,HttpStatus.OK
        );
    }


}
