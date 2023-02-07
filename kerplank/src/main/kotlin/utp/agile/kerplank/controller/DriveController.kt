package utp.agile.kerplank.controller

import com.sun.mail.iap.Response
import org.springframework.data.mongodb.core.aggregation.BooleanOperators.Not
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.web.bind.annotation.*
import org.springframework.web.context.request.ServletWebRequest
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.model.FileDrive
import utp.agile.kerplank.model.UploadFileResponse
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.DriveService
import java.io.File
import java.net.URI
import java.nio.file.Files
import java.util.UUID
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.pathString


@RestController
@RequestMapping("/api/drive")
class DriveController(val driveConfiguration: DriveConfiguration, val driveService: DriveService) {


    @GetMapping("/path")
    fun getMyDirectory(): ResponseEntity<String> {
        return ResponseEntity<String>(
            Path(driveConfiguration.directory).absolutePathString(),
            HttpStatus.OK
        )
    }


    @GetMapping("/directory")
    fun listDirectory(
        @RequestParam path: String
    ): Any {
        driveService.listDirectoryItems(path).let {
            if (it.isNullOrEmpty())
                return ResponseEntity<String>(
                    "Wrong path to directory", HttpStatus.BAD_REQUEST
                )
            else
                return ResponseEntity<List<DriveService.DirectoryItem>>(
                    it, HttpStatus.OK
                )
        }
    }


    @GetMapping(
        "file"
    )
    fun getMyFile(
        @RequestParam("path") pathToFile: String
    ): Any {

        val pathObj = Path(driveConfiguration.directory + pathToFile)
        val mime = Files.probeContentType(pathObj)
        val header = HttpHeaders()
            .apply { set(HttpHeaders.CONTENT_TYPE, mime) }
            .apply { set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${pathToFile.split("/").last()}") }

        println("Requested ${pathObj.pathString}")
        return driveService.readFile(pathToFile)
            .let {
                when (it.result.isSuccess) {
                    true -> ResponseEntity<ByteArray>(it.result.getOrThrow(), header, HttpStatus.OK)
                    else -> ResponseEntity<String>(
                        it.result.exceptionOrNull()?.message ?: "Error occurred",
                        header,
                        HttpStatus.OK
                    )
                }
            }
    }


    @PostMapping("upload") // https://hantsy.github.io/spring-reactive-sample/web/multipart.html
    fun saveFile(
        @RequestPart("fileToUpload") file: Mono<FilePart>,
        @RequestPart("user-name") userName: String
    ): Mono<String> {
        println(userName)


        return file.flatMap { filePart ->
            val x = File(driveConfiguration.directory + "/" + filePart.filename())
            println("Saving file ${filePart.filename()} to [${x.path}]")
            filePart.transferTo(x).subscribe()
            x.path.toString().toMono()
        }
    }

    @PostMapping("/upload/multi")
    fun saveMultipleFile(
        @RequestParam directory:String?,
        @RequestPart("files") files: Flux<FilePart>,
        request: ServerHttpRequest
    ): Mono<ResponseEntity<BaseResponse>> {

        return files.flatMap { filePart ->
            val fullFilename = filePart.filename().replace(" ","_")
//            driveService.createFile(filePart.name())
            
            val x = File(driveConfiguration.directory + "/" + fullFilename)

            println("Saving file ${filePart.filename()} to [${x.path}]")
            filePart.transferTo(x).subscribe()

            FileDrive( x.name, "/${x.name}" ).toMono()
        }.collectList().map { ResponseEntity(UploadFileResponse(it),HttpStatus.CREATED) }
    }

}
