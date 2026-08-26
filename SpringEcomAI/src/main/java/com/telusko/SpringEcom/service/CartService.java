package com.telusko.SpringEcom.service;

import com.telusko.SpringEcom.model.CartItem;
import com.telusko.SpringEcom.model.Product;
import com.telusko.SpringEcom.model.User;
import com.telusko.SpringEcom.repo.CartItemRepo;
import com.telusko.SpringEcom.repo.ProductRepo;
import com.telusko.SpringEcom.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;
    @Transactional
    public List<CartItem> getCart(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return cartItemRepo.findByUser(user);
    }

    public CartItem addToCart(
            String email,
            Integer productId) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (!product.isProductAvailable()) {
            throw new RuntimeException(
                    "Product is not available");
        }

        if (product.getStockQuantity() <= 0) {
            throw new RuntimeException(
                    "Product is out of stock");
        }

        CartItem cartItem =
                cartItemRepo.findByUserAndProduct(
                        user,
                        product
                ).orElse(null);

        if (cartItem == null) {

            cartItem = new CartItem();

            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(1);

        } else {

            if (cartItem.getQuantity()
                    >= product.getStockQuantity()) {

                throw new RuntimeException(
                        "Cannot add more than available stock");
            }

            cartItem.setQuantity(
                    cartItem.getQuantity() + 1
            );
        }

        return cartItemRepo.save(cartItem);
    }
    @Transactional
    public CartItem updateQuantity(
            String email,
            Integer productId,
            int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        CartItem cartItem =
                cartItemRepo.findByUserAndProduct(
                        user,
                        product
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Product not found in cart"));

        if (quantity > product.getStockQuantity()) {
            throw new RuntimeException(
                    "Quantity exceeds available stock");
        }

        cartItem.setQuantity(quantity);

        return cartItemRepo.save(cartItem);
    }
    @Transactional
    public void removeFromCart(
            String email,
            Integer productId) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        cartItemRepo.deleteByUserAndProduct(
                user,
                product
        );
    }
    @Transactional
    public void clearCart(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        cartItemRepo.deleteByUser(user);
    }
}