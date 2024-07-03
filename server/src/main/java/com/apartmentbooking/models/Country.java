package com.apartmentbooking.models;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Country {
    ARGENTINA("Argentina"),
    AUSTRALIA("Australia"),
    BELGIUM("Belgium"),
    BRAZIL("Brazil"),
    CANADA("Canada"),
    CHINA("China"),
    COSTA_RICA("Costa Rica"),
    CZECH_REPUBLIC("Czech Republic"),
    DENMARK("Denmark"),
    EL_SALVADOR("El Salvador"),
    FRANCE("France"),
    GERMANY("Germany"),
    HONG_KONG_SAR("Hong Kong SAR"),
    HUNGARY("Hungary"),
    INDIA("India"),
    IRELAND("Ireland"),
    ITALY("Italy"),
    JAPAN("Japan"),
    KENYA("Kenya"),
    KINGDOM_OF_SAUDI_ARABIA("Kingdom of Saudi Arabia"),
    LATVIA("Latvia"),
    LITHUANIA("Lithuania"),
    MALAYSIA("Malaysia"),
    MEXICO("Mexico"),
    NETHERLANDS("Netherlands"),
    NEW_ZEALAND("New Zealand"),
    NORWAY("Norway"),
    PHILIPPINES("Philippines"),
    POLAND("Poland"),
    PORTUGAL("Portugal"),
    QATAR("Qatar"),
    ROMANIA("Romania"),
    SINGAPORE("Singapore"),
    SPAIN("Spain"),
    SWEDEN("Sweden"),
    SWITZERLAND("Switzerland"),
    THAILAND("Thailand"),
    UNITED_ARAB_EMIRATES("United Arab Emirates"),
    UK("UK"),
    USA("USA");

    private final String countryName;

    Country(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryName() {
        return countryName;
    }

    public static List<String> getCountryNames() {
        return Arrays.stream(Country.values())
                .map(Country::getCountryName)
                .collect(Collectors.toList());
    }
}

