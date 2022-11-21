package utp.agile.kerplank.service

import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserSignUpRequest
import utp.agile.kerplank.model.UserUtils
import utp.agile.kerplank.repository.UserRepository

@Service
class UserService(val userRepository: UserRepository, val ctx: ApplicationContext) {

    fun createUser(model: UserSignUpRequest): Mono<User> {
        val passwordEncoder = ctx.getBean("passwordEncoder", BCryptPasswordEncoder::class.java)
        return userRepository.save(UserUtils.singUp(model, passwordEncoder.encode(model.password)))
    }
}
