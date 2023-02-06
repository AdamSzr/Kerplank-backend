package utp.agile.kerplank.controller

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.service.DriveService
import java.io.File
import java.nio.file.Files
import java.util.UUID
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString


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
        "file", produces = [
            MediaType.TEXT_PLAIN_VALUE,
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE,
            MediaType.ALL_VALUE]
    )
    fun getMyFile(
        @RequestParam("path") pathToFile: String
    ): Any {

        val pathObj = Path(driveConfiguration.directory + pathToFile)
        val mime = Files.probeContentType(pathObj)
        val header = HttpHeaders()
            .apply { set(HttpHeaders.CONTENT_TYPE, mime) }
            .apply { set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${pathToFile.split("/").last()}") }

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
    fun saveMultipleFile(@RequestPart("files") files: Flux<FilePart>): Flux<String> {
        val prefix = UUID.randomUUID()

        return files.flatMap {
            val file = File(driveConfiguration.directory + "/" + it.filename())
            file.createNewFile()
            it.transferTo(file).subscribe()
            println(file.path)
            file.path.toMono()
        }


//        return file.flatMap { filePart ->
//            val x = File(driveConfiguration.directory + "/" + filePart.filename())
//            println("Saving file ${filePart.filename()} to [${x.path}]")
//            filePart.transferTo(x).subscribe()
//            x.path.toString().toMono()
//        }
    }

}
