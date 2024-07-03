package com.apartmentbooking.dto.googleAuthDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GoogleTokenInfoResponse {
    private String issued_to;
    private String audience;
    private String user_id;
    private String scope;
    private int expires_in;
    private String email;
    private boolean verified_email;
    private String access_type;
}
