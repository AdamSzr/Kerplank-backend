package utp.agile.kerplank.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import reactor.core.publisher.Mono
import utp.agile.kerplank.auth.UserAuthManager
import utp.agile.kerplank.repository.SecurityContextRepository

@Configuration
@EnableWebFluxSecurity
class SecurityConfiguration(
    private val authenticationManager: UserAuthManager,
    private val securityContextRepository: SecurityContextRepository
) {

    private val frontendCorsConfiguration = CorsConfiguration().applyPermitDefaultValues()

    private val corsConfiguration: Map<String, CorsConfiguration> = mapOf(
        "/api/**" to frontendCorsConfiguration
    )

    init {
        frontendCorsConfiguration.allowedMethods = listOf("GET", "POST", "PUT", "HEAD", "DELETE")
    }


    @Bean
    fun securityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain =
        http
            .authorizeExchange()
            .pathMatchers(
                "/api/ping",
                "/api/auth/login",
                "/api/auth/signup",
                "/api/auth/reset",
                "/api/drive/upload",
                "/api/drive/upload/multi"
            )
            .permitAll()
            .anyExchange().authenticated().and()
            .cors().and()
            .exceptionHandling()
            .authenticationEntryPoint { serverWebExchange, _ ->
                Mono.fromRunnable {
                    serverWebExchange.response.statusCode = HttpStatus.UNAUTHORIZED
                }
            }
            .accessDeniedHandler { serverWebExchange, _ ->
                Mono.fromRunnable {
                    serverWebExchange.response.statusCode = HttpStatus.FORBIDDEN
                }
            }
            .and()
            .csrf().disable()
            .authenticationManager(authenticationManager)
            .securityContextRepository(securityContextRepository)
            .build()

    @Bean
    fun passwordEncoder(): BCryptPasswordEncoder =
        BCryptPasswordEncoder()


    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val source = UrlBasedCorsConfigurationSource()

        corsConfiguration.entries.forEach { entry ->
            source.registerCorsConfiguration(entry.key, entry.value)
        }

        return source
    }

}
