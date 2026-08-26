package com.telusko.SpringEcom.controller;

import com.telusko.SpringEcom.model.CartItem;
import com.telusko.SpringEcom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {
    @Autowired
    CartService cartService;
     @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication){
        String email=authentication.getName();
        return ResponseEntity.ok(cartService.getCart(email));
    }
    @PostMapping("/add/{productId}")
    public ResponseEntity<CartItem> addToCart(@PathVariable Integer productId, Authentication authentication) {
         String email = authentication.getName();
         System.out.println("Hi the email is: "+email);
        return ResponseEntity.ok(
                cartService.addToCart(email, productId)
        );
    }
        @PutMapping("/{productId}")
        public ResponseEntity<CartItem> updateQuantity(
                @PathVariable Integer productId,
                @RequestBody Map<String, Integer> request,
                Authentication authentication) {

            String email = authentication.getName();

            int quantity = request.get("quantity");

            return ResponseEntity.ok(
                    cartService.updateQuantity(
                            email,
                            productId,
                            quantity
                    )
            );
        }
        @DeleteMapping("/{productId}")
       public ResponseEntity<String> removeFromCart(@PathVariable Integer productId,Authentication authentication){
         String email=authentication.getName();
         cartService.removeFromCart(email,productId);
         return ResponseEntity.ok("Product Removed From cart");
       }
        @DeleteMapping("/clear")
        public ResponseEntity<String> ClearCart(Authentication authentication){
         String email=authentication.getName();
         cartService.clearCart(email);
         return ResponseEntity.ok("Cart cleared");

        }

    }

