package utp.agile.kerplank.service

import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

class UserController(
    private val encoder: PasswordEncoder,
    private val users: ReactiveUserDetailsService,
) {

//    @PostMapping("/login")
//    suspend fun loginFunction(@RequestBody login: Login): Jwt {
//        val user = users.findByUsername(login.username).awaitSingleOrNull()
//
//        user?.let {
//            if (encoder.matches(login.password, user.password))
//                Jwt("u-are-allowed")
//        }
//        throw ResponseStatusException(HttpStatus.UNAUTHORIZED)
//    }
//
//    class Login(val username: String, val password: String)
//    class Jwt(val token: String)
}
