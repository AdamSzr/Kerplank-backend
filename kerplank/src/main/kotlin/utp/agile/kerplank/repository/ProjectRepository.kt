package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import utp.agile.kerplank.model.Project

@Repository
interface ProjectRepository : ReactiveMongoRepository<Project,String>
