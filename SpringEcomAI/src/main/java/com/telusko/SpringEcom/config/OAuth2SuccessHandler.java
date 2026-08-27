package com.telusko.SpringEcom.config;

import com.telusko.SpringEcom.model.User;
import com.telusko.SpringEcom.repo.UserRepo;
import com.telusko.SpringEcom.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepo.findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setName(name);
                    newUser.setEmail(email);

                    // Google OAuth user does not use local password
                    newUser.setPassword("");

                    newUser.setRole("USER");

                    return userRepo.save(newUser);
                });

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        String redirectUrl =
                "https://smart-i-kart-frontend-git-razorpay-dhruvraj1892.vercel.app/oauth2/success"
                        + "?token=" + URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                )
                        + "&name=" + URLEncoder.encode(
                        user.getName(),
                        StandardCharsets.UTF_8
                )
                        + "&email=" + URLEncoder.encode(
                        user.getEmail(),
                        StandardCharsets.UTF_8
                )
                        + "&role=" + URLEncoder.encode(
                        user.getRole(),
                        StandardCharsets.UTF_8
                );

        getRedirectStrategy().sendRedirect(
                request,
                response,
                redirectUrl
        );
    }
}