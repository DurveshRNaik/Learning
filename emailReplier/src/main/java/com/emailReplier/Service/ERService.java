package com.emailReplier.Service;

import com.emailReplier.Pojo.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class ERService {

    private final WebClient wc;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public ERService(WebClient.Builder wcb) {
        this.wc = wcb.build();
    }

    public String generateEmailReply(EmailRequest er){
        //build the prompt
        String prompt = buildPrompt(er);

        //create a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts" , new Object[]{
                                Map.of("text" , prompt)
                        })
                }
        );

        //do request and get response
        String resp = wc.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //return response
        return extractResp(resp);
    }

    private String extractResp(String resp) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(resp);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        }catch (Exception e){
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest er) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line ");
        if (er.getTone()!=null && !er.getTone().isEmpty()){
            prompt.append("Use a ").append(er.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(er.getEmailContent());
        return prompt.toString();
    }
}
