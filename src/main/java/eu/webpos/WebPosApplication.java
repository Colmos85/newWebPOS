package eu.webpos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

@SpringBootApplication
//@Configuration
//@ComponentScan
//@EnableJpaRepositories
//@Import(RepositoryRestMvcConfiguration.class)
//@EnableAutoConfiguration
public class WebPosApplication extends SpringBootServletInitializer{   

	public static void main(String[] args) {
		SpringApplication.run(WebPosApplication.class, args);
	}
}
