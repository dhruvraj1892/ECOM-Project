package com.telusko.SpringEcom.service;

import com.telusko.SpringEcom.model.User;
import com.telusko.SpringEcom.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
@Service
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
                System.out.println("valid  request");
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));
            System.out.println(user.getName());
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole())
                )
        );
    }
}
