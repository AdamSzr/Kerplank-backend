package utp.agile.kerplank.service

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.model.PasswordResetEntry
import utp.agile.kerplank.model.PasswordResetRequest
import utp.agile.kerplank.model.User
import utp.agile.kerplank.repository.PasswordResetRepository
import java.util.*


@Service
class PasswordResetService(
    private val passwordResetRepository: PasswordResetRepository,
    private val emailService: EmailService,
    private val passwordEncoder: BCryptPasswordEncoder,
    private val userService: UserService
) {


    fun handleUserPasswordReset(request: PasswordResetRequest): Mono<Boolean> {
        return passwordResetRepository.findByUuid(request.uuid)
            .doOnNext {
                passwordResetRepository.deleteByUuid(request.uuid).subscribe()
                userService.changeUserPassword(it.email, request.password).subscribe()
            }.flatMap { true.toMono() }

    }

    fun createNewPasswordResetEntry(userEmail: String): Mono<PasswordResetEntry> {
        val passwordResetEntry = PasswordResetEntry(email = userEmail, uuid = UUID.randomUUID().toString())
        return userService.getUserByEmail(userEmail)
            .flatMap {
                passwordResetRepository.save(passwordResetEntry)
                    .doOnNext {
                        val sended = emailService.sendEmail(
                            "kerplank.project@gmail.com",
                            userEmail,
                            "Kerplank Password Reset",
                            "Your unique token to password reset is: ${passwordResetEntry.uuid}"
                        )
                    }
            }


    }


}
