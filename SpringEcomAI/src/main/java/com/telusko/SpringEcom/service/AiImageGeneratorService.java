package com.telusko.SpringEcom.service;

import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        System.out.println("Image generation requested");

        ImageResponse response =
                imageModel.call(
                        new ImagePrompt(imagePrompt, options)
                );

        System.out.println("response returned");

        String b64 = response.getResult()
                .getOutput()
                .getB64Json();

        if (b64 != null) {
            System.out.println("Image generated successfully");
            return Base64.getDecoder().decode(b64);
        }

        throw new RuntimeException(
                "No image data returned from OpenAI"
        );
    }
}