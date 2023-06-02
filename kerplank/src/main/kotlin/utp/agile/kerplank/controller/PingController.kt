package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.response.SuccessResponse


@RestController()
@RequestMapping("/api/ping")
class PingController {

    @GetMapping
    @Operation(summary = "Sprawdź połączenie z serwerem.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje odpowiedź ping-pong.")
    fun pingPong(): ResponseEntity<BaseResponse> {
        return ResponseEntity<BaseResponse>(SuccessResponse(),HttpStatus.OK)
    }

}
