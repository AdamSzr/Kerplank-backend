package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
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
    @Operation(summary = "Wyślij email.", description = "Zwraca ResponseEntity z obiektem typu Boolean, który reprezentuje informację o sukcesie wysłania e-maila (true) lub błędzie (false).")
    fun sendEmail(): ResponseEntity<Boolean> {
        return ResponseEntity<Boolean>(
            emailService.sendEmail(
                "adam.szr98333333@gmail.com",
                "testowy email",
                "treść"
            ),
            HttpStatus.OK
        )
    }
}
