package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.MODERATOR_ROLE
import utp.agile.kerplank.model.*
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.ProjectService


@RestController
@RequestMapping("/api/project")
class ProjectController(private val projectService: ProjectService) {

    @GetMapping
    @Operation(summary = "Pobierz wszystkie projekty.", description = "Zwraca obiekt typu ProjectListResponse, który reprezentuje listę wszystkich projektów.")
    fun getAll(): Mono<ProjectListResponse> {
        return projectService
            .findAllProjects()
            .collectList()
            .flatMap { ProjectListResponse(it).toMono() }
    }

    @GetMapping("/my")
    @Operation(summary = "Pobierz projekty powiązane z zalogowanym użytkownikiem.", description = "Zwraca obiekt typu ProjectListResponse, który reprezentuje listę projektów powiązanych z zalogowanym użytkownikiem.")
    fun getMyProj(authenticatedUser: AuthenticatedUser): Mono<ProjectListResponse> {
        return projectService
            .findMyProjects(authenticatedUser.email)
            .collectList()
            .flatMap { ProjectListResponse(it).toMono() }
    }


    @PostMapping
    @Operation(summary = "Utwórz nowy projekt.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o utworzonym projekcie lub błąd.")
    fun createProject(
        @RequestBody projectCreateRequest: ProjectCreateRequest,
        authenticatedUser: AuthenticatedUser
    ): Mono<ResponseEntity<out BaseResponse>> {
        if (!authenticatedUser.roles.contains(MODERATOR_ROLE)) {
            return ResponseEntity(BaseResponse("fail"), null, HttpStatus.FORBIDDEN).toMono()
        }

        return projectService.createProject(authenticatedUser.email, projectCreateRequest)
            .flatMap {
                ResponseEntity<ProjectResponse>(
                    ProjectResponse(it),
                    null,
                    HttpStatus.CREATED
                ).toMono()
            }
    }

    @PostMapping("/task")
    @Operation(summary = "Utwórz nowe zadanie projektu.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o utworzonym zadaniu lub błąd.")
    fun createTask(
        @RequestBody taskRequest: TaskCreateRequest,
        authenticatedUser: AuthenticatedUser,
    ): Mono<ResponseEntity<BaseResponse>> {
        return projectService.createTask(authenticatedUser.email, taskRequest)
            .mapNotNull { ResponseEntity(ProjectResponse(it) as BaseResponse, null, HttpStatus.CREATED) }
            .switchIfEmpty { ResponseEntity(BaseResponse("fail"), null, HttpStatus.NO_CONTENT).toMono() }
    }

    @PutMapping("/task/{taskId}")
    @Operation(summary = "Zaktualizuj zadanie projektu o określonym identyfikatorze.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o zaktualizowanym zadaniu lub błąd.")
    fun updateTask(
        @RequestBody taskUpdateRequest: TaskUpdateRequest,
        @PathVariable taskId: String,
        authenticatedUser: AuthenticatedUser,
    ): Mono<ResponseEntity<BaseResponse>> {
        return projectService.updateTask(authenticatedUser.email, taskId, taskUpdateRequest)
            .mapNotNull { ResponseEntity(ProjectResponse(it) as BaseResponse, null, HttpStatus.CREATED) }
            .switchIfEmpty { ResponseEntity(BaseResponse("fail"), null, HttpStatus.NO_CONTENT).toMono() }
    }


    @PutMapping("/{projectId}")
    @Operation(summary = "Zaktualizuj projekt o określonym identyfikatorze.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o zaktualizowanym projekcie lub błąd.")
    fun updateProject(
        @PathVariable projectId: String,
        @RequestBody update: ProjectUpdateRequest,
        authenticatedUser: AuthenticatedUser
    ): Mono<ResponseEntity<BaseResponse>> {
        return projectService.updateProject(authenticatedUser.email, projectId, update)
            .mapNotNull { ResponseEntity(ProjectResponse(it) as BaseResponse, null, HttpStatus.OK) }
            .switchIfEmpty { ResponseEntity(BaseResponse("fail"), null, HttpStatus.FORBIDDEN).toMono() }
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Pobierz projekt o określonym identyfikatorze.", description = "Zwraca obiekt typu ProjectResponse, który reprezentuje informacje o projekcie na podstawie jego identyfikatora.")
    fun getProj(@PathVariable projectId: String, authenticatedUser: AuthenticatedUser): Mono<ProjectResponse> {
        return projectService
            .findProjectById(projectId, authenticatedUser.email)
            .flatMap { ProjectResponse(it).toMono() }
    }


    @DeleteMapping("/{projectId}")
    @Operation(summary = "Usuń projekt o określonym identyfikatorze.", description = "Zwraca obiekt typu ResponseEntity, który reprezentuje informacje o usuniętym projekcie lub błąd.")
    fun deleteProject(
        @PathVariable projectId: String,
        @RequestParam userEmail: String?,
        @RequestParam filePath: String?,
        @RequestParam taskId: String?,
        authenticatedUser: AuthenticatedUser
    ): Mono<out ResponseEntity<out Any>> {

        return when {
            !userEmail.isNullOrBlank() -> {
                projectService.deleteUserFromProject(authenticatedUser.email, projectId, userEmail)
                    .mapNotNull { ResponseEntity(ProjectResponse(it), HttpStatus.OK) }
                    .switchIfEmpty { ResponseEntity<ProjectResponse>(HttpStatus.FORBIDDEN).toMono() }
//                Mono.just("Delete - user from project")
            }

            !filePath.isNullOrBlank() -> {
                projectService.deletePathFromProject(authenticatedUser.email, projectId, filePath)
                    .mapNotNull { ResponseEntity(ProjectResponse(it), HttpStatus.OK) }
                    .switchIfEmpty { Mono.just(ResponseEntity(HttpStatus.FORBIDDEN)) }
//                Mono.just("Delete - file from project")
            }

            !taskId.isNullOrBlank() -> {
                projectService.deleteTaskFromProject(authenticatedUser.email, projectId, taskId)
                    .mapNotNull { ResponseEntity(ProjectResponse(it), HttpStatus.OK) }
                    .switchIfEmpty { Mono.just(ResponseEntity(HttpStatus.FORBIDDEN)) }
//                Mono.just("Delete - task from project")
            }

            else -> {
                projectService.deleteProject(authenticatedUser.email, projectId)
                    .flatMap { ResponseEntity.ok().build<Project>().toMono() }
                    .switchIfEmpty { ResponseEntity.noContent().build<Project>().toMono() }
            }
        }
        // todo create acctualy normal responses.
    }


}
