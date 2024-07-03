package com.apartmentbooking.exception.authentication;

import lombok.Getter;

public class RegistrationError {
    public static String EMAIL_EXISTS = "This email is already registered.";
    public static String NAME_TOO_LONG = "First name must not exceed 20 characters.";
    public static String LAST_NAME_TOO_LONG = "Last name must not exceed 20 characters.";
    public static String EMAIL_TOO_LONG = "Email must not exceed 50 characters.";
    public static String JOB_TITLE_TOO_LONG = "Job title must not exceed 50 characters.";
    public static String CITY_NAME_TOO_LONG = "City must not exceed 50 characters.";
    public static String COUNTRY_NOT_FOUND = "Invalid country specified.";
}
