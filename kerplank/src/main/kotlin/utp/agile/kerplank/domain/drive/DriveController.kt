package utp.agile.kerplank.domain.drive

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.domain.utils.randomString
import utp.agile.kerplank.domain.utils.writeToTextFile
import utp.agile.kerplank.domain.utils.structures.request.NoteSaveRequest
import utp.agile.kerplank.domain.utils.structures.response.NoteSaveResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import java.nio.file.Files
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString


@RestController
@RequestMapping("/api/drive")
class DriveController(val driveConfiguration: DriveConfiguration, val driveService: DriveService) {


    @GetMapping("/path")
    fun getMyDirectory(): ResponseEntity<String> {
        return ResponseEntity<String>(Path(driveConfiguration.directory).absolutePathString(), HttpStatus.OK)
    }


    @GetMapping("/directory")
    fun listDirectory(
        @RequestParam path: String
    ): Any {
        driveService.listDirectoryItems(path).let {
            if (it.isNullOrEmpty())
                return ResponseEntity<String>(
                    "Wrong path to directory", null, HttpStatus.BAD_REQUEST
                )
            else
                return ResponseEntity<List<DriveService.DirectoryItem>>(
                    it, null, HttpStatus.OK
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

    @PostMapping
    fun saveNote(@RequestBody noteRequest: NoteSaveRequest): ResponseEntity<NoteSaveResponse> {
        return kotlin.runCatching {
            driveService.driveDirectory.writeToTextFile(
                noteRequest.fileNameWithExt,
                noteRequest.message + randomString(100_000_0)
            )
        }.let {
            when (it.isSuccess) {
                true -> ResponseEntity<NoteSaveResponse>(
                    NoteSaveResponse(
                        it.getOrThrow().absolutePath.replace(
                            driveService.driveDirectory.absolutePath,
                            ""
                        )
                    ),
                    HttpStatus.OK
                )
                else -> ResponseEntity<NoteSaveResponse>(NoteSaveResponse(null), HttpStatus.BAD_REQUEST)
            }
        }
    }

}
