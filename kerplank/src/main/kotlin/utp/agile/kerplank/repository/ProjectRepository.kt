package utp.agile.kerplank.repository

import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.Project

@Repository
interface ProjectRepository : ReactiveMongoRepository<Project,String>{

    @org.springframework.data.mongodb.repository.Query("{ 'users.email': ?0  }")
    fun  findAllByUsersEquals(email:String): Flux<Project>

    @org.springframework.data.mongodb.repository.Query("{ '\$and': [{ 'users.email': ?0  }, {'_id': ?1}] }")
    fun  findByIdAndUserEmail( email:String, id:String): Mono<Project>
}
