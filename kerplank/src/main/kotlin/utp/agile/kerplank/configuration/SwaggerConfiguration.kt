package utp.agile.kerplank.configuration
import io.swagger.v3.oas.models.ExternalDocumentation
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class SwaggerConfiguration {
    //http://localhost:8080/webjars/swagger-ui/index.html
    @Bean
    fun springShopOpenAPI(): OpenAPI =
        OpenAPI()
            .info(
                Info()
                    .title("Kerplank project.")
                    .description("""
                        ##  Aplikacja Webowa do zarządzania projektami przy użyciu technik programowania zwinnego
                    """.trimIndent())
                    .version("v0.0.1")
                    .license(License().name("Apache 2.0").url("http://springdoc.org"))
            )
}
