package com.emailReplier.Pojo;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
    private String msg;
}
