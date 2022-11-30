package utp.agile.kerplank.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.ProjectRepository


@Service
class ProjectService(val projectRepository: ProjectRepository) {

    fun createProject(request: ProjectCreateRequest): Mono<Project> {
        val project = request.createProject()
        
        return projectRepository.save(project)
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

    fun updateProject(projectId:String,request: ProjectUpdateRequest): Mono<Project> {
      return  when {
            request.files != null -> {
                projectRepository.findById(projectId)
                    .doOnNext { it.appendFiles(request.files) }
                    .flatMap { projectRepository.save(it) }
                    .switchIfEmpty { Mono.empty() }
            }

            request.users != null -> {
                projectRepository.findById(projectId)
                    .doOnNext { it.appendUsers(request.users) }
                    .flatMap { projectRepository.save(it) }
                    .switchIfEmpty { Mono.empty() }
            }

            else -> Mono.empty()
        }
    }

}
