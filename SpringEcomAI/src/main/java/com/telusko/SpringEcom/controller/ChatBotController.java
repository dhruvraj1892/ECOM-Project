package com.telusko.SpringEcom.controller;

import com.telusko.SpringEcom.repo.OrderRepo;
import com.telusko.SpringEcom.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatBotController {
    @Autowired
    OrderRepo orderRepo;
    @Autowired
    private ChatBotService chatBotService;

    @GetMapping("/ask")
    public ResponseEntity<String> askBot(@RequestParam String message, Authentication authentication){
//      System.out.println(orderRepo.findByOrderId("ORDACA0F3CC"));
        System.out.println("have you asked ai assistant for any help?");

        String email = authentication.getName();
        String response = chatBotService.getBotResponse(message,email,authentication);
        return ResponseEntity.ok(response);
    }
}
