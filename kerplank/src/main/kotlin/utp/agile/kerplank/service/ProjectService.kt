package utp.agile.kerplank.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toFlux
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.ProjectRepository
import utp.agile.kerplank.repository.UserRepository


@Service
class ProjectService(val projectRepository: ProjectRepository, val userRepository: UserRepository) {

    fun createProject(creatorEmail: String, request: ProjectCreateRequest): Mono<Project> {
        val project = request.createProject()

        return userRepository.findByEmail(creatorEmail)
            .map { project.appendUser(it) }
            .flatMap { projectRepository.save(it) }
    }

    fun findAllProjects(): Flux<Project> {
        return projectRepository.findAll()
    }

    fun createTask(request: TaskCreateRequest): Mono<Project> {
        val task = request.createTask()

        return projectRepository.findById(request.projectId)
            .doOnNext { it.appendTask(task) }
            .flatMap { projectRepository.save(it) }
            .switchIfEmpty { Mono.empty() }
    }

    fun updateProject(projectId: String, request: ProjectUpdateRequest): Mono<Project> {
        return when {
            request.files != null -> {
                projectRepository.findById(projectId)
                    .doOnNext { it.appendFiles(request.files) }
                    .flatMap { projectRepository.save(it) }
                    .switchIfEmpty { Mono.empty() }
            }

            request.users != null -> {
                return  request.users.toFlux()
                    .flatMap() { userRepository.findByEmail(it) }
                    .collectList()
                    .flatMap { userList ->
                        projectRepository.findById(projectId).map { project ->
                            project.appendUsers(userList)
                        }
                            .flatMap { project -> projectRepository.save(project) }
                            .switchIfEmpty { Mono.empty() }
                    }
            }

            else -> Mono.empty()
        }
    }

}
