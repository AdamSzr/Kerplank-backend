package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.model.DirectoryItem
import utp.agile.kerplank.model.event.FileDeleteEvent
import utp.agile.kerplank.model.event.ProjectFileUpdateEvent
import utp.agile.kerplank.response.DirectoryItemsResponse
import utp.agile.kerplank.service.DriveService
import java.nio.file.Files
import kotlin.io.path.Path
import kotlin.io.path.absolutePathString
import kotlin.io.path.pathString


@RestController
@RequestMapping("/api/drive")
class DriveController(
    private val appContext: ApplicationContext,
    val driveConfiguration: DriveConfiguration,
    val driveService: DriveService

) {


    @GetMapping("/path")
    @Operation(summary = "Pobierz informacje o pliku lub katalogu na podstawie ścieżki.", description = "Zwraca ResponseEntity z obiektem typu String, który reprezentuje informacje o katalogu powiązanym z zalogowanym użytkownikiem.")
    fun getMyDirectory(): ResponseEntity<String> {
        return ResponseEntity<String>(
            Path(driveConfiguration.directory).absolutePathString(),
            HttpStatus.OK
        )
    }


    @GetMapping("/directory")
    @Operation(summary = "Pobierz informacje o zawartości katalogu.", description = "Zwraca ResponseEntity z obiektem typu DirectoryItemsResponse, który reprezentuje informacje o zawartości katalogu na podstawie przekazanej ścieżki lub informację o błędzie.")
    fun listDirectory(
        @RequestParam path: String
    ): Any {

        driveService.listDirectoryItems(path).let {
            if (it == null)
                return ResponseEntity<String>(
                    "Directory not Exists", HttpStatus.NOT_FOUND
                )
            else
                return ResponseEntity<DirectoryItemsResponse>(
                    DirectoryItemsResponse(it), HttpStatus.OK
                )
        }
    }


    @GetMapping(
        "file"
    )
    @Operation(summary = "Pobierz plik na podstawie ścieżki.", description = "Zwraca obiekt, który reprezentuje informacje o pliku powiązanym z zalogowanym użytkownikiem na podstawie przekazanej ścieżki.")
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
    @Operation(summary = "Prześlij plik.", description = "Zwraca obiekt typu String, który reprezentuje informacje o zapisanym pliku lub ścieżce do zapisanego pliku.")
    fun saveFile(
        @RequestPart("fileToUpload") file: Mono<FilePart>,
        @RequestPart("user-name") userName: String
    ): Mono<String> {
        println(userName)


        return file.flatMap { filePart ->
            val fullFilename = filePart.filename().replace(" ", "_")
            val destinationFile = driveService.createFile(filePart.name())
            println("Saving file ${filePart.filename()} to [${destinationFile.path}]")
            filePart.transferTo(destinationFile).subscribe()
            destinationFile.path.toString().toMono()
        }
    }

    @PostMapping("/upload/multi")
    @Operation(summary = "Prześlij wiele plików.", description = "Zwraca ResponseEntity z obiektem typu DirectoryItemsResponse, który reprezentuje informacje o zapisanych plikach w podanym katalogu.")
    fun saveMultipleFile(
        @RequestParam directory: String,
        @RequestPart("files") files: Flux<FilePart>,
        request: ServerHttpRequest
    ): Mono<ResponseEntity<DirectoryItemsResponse>> {

        val projectId = directory.trimStart('/')
        return files.flatMap { filePart ->

            val fullFilename = filePart.filename().replace(" ", "_")

            val destinationFile =driveService.createFile(fullFilename,directory)

            println("Saving file $fullFilename to [${destinationFile.path}]")
            filePart.transferTo(destinationFile).subscribe()

            val directoryItem = driveService.createDirectoryItem(destinationFile)
//            appContext.publishEvent(ProjectFileUpdateEvent(projectId, listOf(DirectoryItem(false,false,"path","name"))))
            directoryItem.toMono()
        }.collectList()
            .doOnNext{   appContext.publishEvent(ProjectFileUpdateEvent(projectId, it ))}
            .map { it ->  ResponseEntity(DirectoryItemsResponse(it), HttpStatus.CREATED)}
    }


    @GetMapping("mkdir")
    @Operation(summary = "Utwórz nowy katalog.", description = "Zwraca ResponseEntity z obiektem typu DirectoryItemsResponse, który reprezentuje informacje o utworzonym katalogu lub błąd.")
    fun createDirectory(
        @RequestParam path: String,
        request: ServerHttpRequest
    ): ResponseEntity<DirectoryItemsResponse> {
        val pathsToCreate = path.split(",")

        val directories = driveService.createSubDirectories(pathsToCreate)
        val items =
            directories.filter { it.result.isSuccess }.map { driveService.createDirectoryItem(it.result.getOrThrow()) }

        return ResponseEntity(DirectoryItemsResponse(items), HttpStatus.CREATED)

    }


    @DeleteMapping("file")
    @Operation(summary = "Usuń plik na podstawie ścieżki.", description = "Nie zwraca żadnego obiektu, służy do usuwania pliku na podstawie przekazanej ścieżki.")
    fun fileDelete( @RequestParam path: String){
        driveService.deleteFile(path)
        appContext.publishEvent( FileDeleteEvent(path) )
    }


}
