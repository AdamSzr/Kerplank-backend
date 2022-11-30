package utp.agile.kerplank.controller

import com.fasterxml.jackson.databind.ser.Serializers.Base
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.model.*
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.ProjectService


@RestController
@RequestMapping("/api/project")
class ProjectController(private val projectService: ProjectService) {

    @GetMapping
    fun getAll(): Mono<ProjectListResponse> {
        return projectService
            .findAllProjects()
            .collectList()
            .flatMap { ProjectListResponse(it).toMono() }
    }

    @PostMapping
    fun createProject(
        @RequestBody projectCreateRequest: ProjectCreateRequest,
        authenticatedUser: AuthenticatedUser
    ): Mono<ResponseEntity<ProjectResponse>> {
        return projectService.createProject(
            projectCreateRequest.apply { users.add(authenticatedUser.username) }
        ).flatMap {
            ResponseEntity<ProjectResponse>(
                ProjectResponse(it),
                null,
                HttpStatus.CREATED
            ).toMono()
        }
    }

    @PostMapping("/task")
    fun createTask(
        @RequestBody taskRequest: TaskCreateRequest
    ): Mono<ResponseEntity<BaseResponse>> {
        return projectService.createTask(taskRequest)
            .mapNotNull { ResponseEntity(ProjectResponse(it) as BaseResponse, null, HttpStatus.CREATED) }
            .switchIfEmpty { ResponseEntity(BaseResponse("fail"), null, HttpStatus.NO_CONTENT).toMono() }

    }

    @PutMapping("/{projectId}")
    fun updateProject(
        @PathVariable projectId: String,
        @RequestBody update: ProjectUpdateRequest
    ): Mono<ResponseEntity<BaseResponse>> {
        return projectService.updateProject(projectId, update)
            .mapNotNull { ResponseEntity(ProjectResponse(it) as BaseResponse, null, HttpStatus.OK) }
            .switchIfEmpty { ResponseEntity(BaseResponse("fail"), null, HttpStatus.NO_CONTENT).toMono() }
    }


}
