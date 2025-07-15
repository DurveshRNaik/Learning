package com.emailReplier.Controller;

import com.emailReplier.Pojo.EmailRequest;
import com.emailReplier.Service.ERService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ERController {
// /api/email/generate
    private final ERService es;

    @PostMapping("/generate")
    public ResponseEntity<String> generateReply(@RequestBody EmailRequest er){
        String response = es.generateEmailReply(er);
        return ResponseEntity.ok(response);
    }
}
