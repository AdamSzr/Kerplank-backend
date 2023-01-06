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
        val project = request.createProject(creatorEmail)

        return userRepository.findByEmail(creatorEmail)
            .map { project.appendUser(it.email) }
            .flatMap { projectRepository.save(it) }
    }

    fun findAllProjects(): Flux<Project> {
        return projectRepository.findAll()
    }

    fun findMyProjects(email: String): Flux<Project> {
        return projectRepository.findAllByUsersEquals(email)
    }

    fun findProjectById(id: String, email: String): Mono<Project> {
        return projectRepository.findByIdAndUserEmail(id = id, email = email)
    }


    fun createTask(userEmail: String, request: TaskCreateRequest): Mono<Project> {
        val task = request.createTask()

        return projectRepository.findByIdAndUserEmail(email = userEmail, id = request.projectId)
            .doOnNext { it.appendTask(task) }
            .flatMap { projectRepository.save(it) }
            .switchIfEmpty { Mono.empty() }
    }

    fun updateTask(userEmail: String, taskId: String, request: TaskUpdateRequest): Mono<Project> {
        return projectRepository.findProjectWithTaskId(userEmail, taskId)
            .flatMap {
                val targetTask = it.tasks.find { task -> task.id == taskId }
                return@flatMap if (targetTask != null) {
                    targetTask.update(request)
                    projectRepository.save(it)
                } else Mono.empty()
            }

    }

    fun updateProject(userEmail: String, projectId: String, request: ProjectUpdateRequest): Mono<Project> {

        return when {
            request.files != null -> {
                projectRepository.findByIdAndUserEmail(email = userEmail, id = projectId)
                    .doOnNext { it.appendFiles(request.files) }
                    .flatMap { projectRepository.save(it) }
                    .switchIfEmpty { Mono.empty() }
            }

            request.users != null -> {
                return request.users.toFlux()
                    .flatMap { userRepository.findByEmail(it) }
                    .collectList()
                    .flatMap { userList ->
                        projectRepository.findByIdAndUserEmail(email = userEmail, id = projectId)
                            .filter { it.creator == userEmail }
                            .map { project ->
                                project.appendUsers(userList.map { it.email })
                            }
                            .flatMap { project -> projectRepository.save(project) }
                            .switchIfEmpty { Mono.empty() }
                    }
                    .switchIfEmpty { Mono.empty() }
            }

            request.description != null -> {
                projectRepository.findByIdAndUserEmail(userEmail, projectId)
                    .doOnNext { project -> project.updateDescription(request.description) }
                    .flatMap { projectRepository.save(it) }
            }

            request.status != null -> {
                projectRepository.findByIdAndUserEmail(userEmail, projectId)
                    .doOnNext { project -> project.updateStatus(request.status) }
                    .flatMap { projectRepository.save(it) }
            }

            else -> Mono.empty()
        }
    }


    fun deleteProject(creatorEmail: String, projectId: String): Mono<Project> {
        return projectRepository.findByIdAndCreator(creatorEmail, projectId)
            .doOnNext {
                projectRepository.deleteById(projectId).subscribe()
            }
    }

    fun deleteUserFromProject(creatorEmail: String, projectId: String, userEmail: String): Mono<Project> {
        return projectRepository.findByIdAndCreator(id =  projectId, creatorEmail = creatorEmail )
            .flatMap {  // TODO info that there is not this file to delete
                it.users.remove(userEmail)
                projectRepository.save(it)
            }
    }


    fun deletePathFromProject(creatorEmail: String, projectId: String, filePath: String): Mono<Project> {
        return projectRepository.findByIdAndCreator(id = projectId, creatorEmail =  creatorEmail)
            .flatMap { // TODO info that there is not this file to delete
                if (it.files.remove(filePath)) {
                    projectRepository.save(it)
                } else Mono.empty()
            }
    }

    fun deleteTaskFromProject(userEmail: String, projectId: String, taskId: String): Mono<Project> {
        return projectRepository.findByIdAndUserEmail(userEmail, projectId)
            .flatMap { // TODO info that there is not this file to delete
                it.tasks.removeIf { task -> task.id == taskId }
                projectRepository.save(it)
            }
            .switchIfEmpty { Mono.empty() }
    }

}
