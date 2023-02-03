package utp.agile.kerplank.service

import org.springframework.context.ApplicationContext
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserSignUpRequest
import utp.agile.kerplank.model.UserUtils
import utp.agile.kerplank.repository.UserRepository

@Service
class UserService(private val userRepository: UserRepository, val passwordEncoder: BCryptPasswordEncoder) {

    fun createUser(model: UserSignUpRequest): Mono<User> {
        return userRepository.save(UserUtils.singUp(model, passwordEncoder.encode(model.password)))
    }


    fun changeUserPassword(userEmail: String, newPassword: String): Mono<User> {
       return userRepository.findByEmail(userEmail)
            .doOnNext { it.password = passwordEncoder.encode(newPassword) }
            .flatMap { userRepository.save(it) }
    }


    fun getUserByEmail(email: String): Mono<User> {
        return userRepository.findByEmail(email)
    }

    fun getAllUsers(): Flux<User> {
        return userRepository.findAll()

    }

    fun deleteUser(nickname: String): Mono<Void> {
        return userRepository.deleteById(nickname)
    }

}
