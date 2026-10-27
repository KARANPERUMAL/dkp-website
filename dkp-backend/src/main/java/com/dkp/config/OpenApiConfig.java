package com.dkp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DKP Innovations API")
                        .version("1.0.0")
                        .description("Production REST API supporting Careers application submissions, Services inquiries, and Contact Us forms.")
                        .contact(new Contact()
                                .name("DKP Innovations Engineering")
                                .email("info@dkpinnovation.com")
                                .url("https://dkpinnovation.com"))
                        .license(new License().name("Proprietary").url("https://dkpinnovation.com/terms")));
    }
}
