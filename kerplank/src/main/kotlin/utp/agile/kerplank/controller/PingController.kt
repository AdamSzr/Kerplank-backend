package utp.agile.kerplank.controller

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
    fun pingPong(): ResponseEntity<BaseResponse> {
        return ResponseEntity<BaseResponse>(SuccessResponse(),HttpStatus.OK)
    }

}
