package utp.agile.kerplank.auth

import utp.agile.kerplank.model.AuthenticatedUser


import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class UserAuthManager: ReactiveAuthenticationManager {

    override fun authenticate(authentication: Authentication): Mono<Authentication> {
        val authToken = authentication.credentials.toString()
        val username: String? = try { TokenProvider.getUsernameFromToken(authToken) } catch (e: Exception) { null }

        return if (username != null && !TokenProvider.isTokenExpired(authToken)) {
            val authorities = TokenProvider.getRolesKeyFromToken(authToken)
                .map { SimpleGrantedAuthority(it) }

            Mono.just(AuthenticatedUser(username, authorities))
        } else {
            Mono.empty()
        }
    }
}
