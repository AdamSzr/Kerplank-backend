package utp.agile.kerplank.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import utp.agile.kerplank.service.EmailService

@RestController
@RequestMapping("/api/email")
class EmailController(val emailService: EmailService) {

    @GetMapping("/send")
    fun sendEmail(): ResponseEntity<Boolean> {
        return ResponseEntity<Boolean>(
            emailService.sendEmail(
                "kerplank.project@gmail.com",
                "adam.szr98@gmail.com",
                "testowy email",
                "treść"
            ),
            HttpStatus.OK
        )
    }
}
