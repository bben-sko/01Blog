package com.blog.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidationResponse {
    private boolean isValid;
    private String err;
}
