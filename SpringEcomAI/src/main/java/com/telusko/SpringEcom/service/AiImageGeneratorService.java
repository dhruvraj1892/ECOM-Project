package com.telusko.SpringEcom.service;

import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.Base64;

@Service
public class AiImageGeneratorService {

    @Autowired
    private ImageModel imageModel;

    public byte[] generateImage(String imagePrompt) {

        OpenAiImageOptions options = OpenAiImageOptions.builder()
                .N(1)
                .width(1024)
                .height(1024)
                .quality("medium")
                .model("gpt-image-1")
                .build();

        ImageResponse response = imageModel.call(new ImagePrompt(imagePrompt, options));

        String imageUrl = response.getResult().getOutput().getUrl();
        String b64 = response.getResult().getOutput().getB64Json();

        try {
            if (imageUrl != null) {
                return new URL(imageUrl).openStream().readAllBytes();
            } else if (b64 != null) {
                return Base64.getDecoder().decode(b64);
            } else {
                throw new RuntimeException("No image data returned from OpenAI");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}