package utp.agile.kerplank.domain.email

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/email")
class EmailController(val emailService: EmailService) {

    @GetMapping("/send")
    fun sendEmail(): ResponseEntity<Boolean> {
        return ResponseEntity<Boolean>(
            emailService.sendEmail(
                "kerplank.project@gmail.com",
                "kerplank.project@gmail.com",
                "testowy email",
                "treść"
            ),
            HttpStatus.OK
        )
    }
}