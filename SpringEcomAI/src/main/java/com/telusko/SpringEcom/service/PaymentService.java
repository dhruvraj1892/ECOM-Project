
package com.telusko.SpringEcom.service;

import com.razorpay.Utils;
import com.telusko.SpringEcom.model.dto.PaymentVerificationRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.secret}")
    private String keySecret;
    @Autowired
    private OrderService orderService;
    public boolean verifyPayment(PaymentVerificationRequest request) {

        try {
            JSONObject options = new JSONObject();

            options.put("razorpay_order_id", request.razorpayOrderId());
            options.put("razorpay_payment_id", request.razorpayPaymentId());
            options.put("razorpay_signature", request.razorpaySignature());

            boolean verified=Utils.verifyPaymentSignature(options, keySecret);
            if(verified){
//                System.out.println("Verification request");
                 return true;
            }
            return false;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}