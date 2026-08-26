package com.telusko.SpringEcom.repo;

import com.telusko.SpringEcom.model.CartItem;
import com.telusko.SpringEcom.model.Product;
import com.telusko.SpringEcom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem,Long> {
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(
            User user,
            Product product
    );

    void deleteByUserAndProduct(
            User user,
            Product product
    );

    void deleteByUser(User user);
    void deleteByProductId(int productId);
}
