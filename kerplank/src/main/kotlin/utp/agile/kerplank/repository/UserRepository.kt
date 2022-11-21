package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.User


@Repository
interface UserRepository: ReactiveMongoRepository<User, String> {

    @Query("{ '_id' : {\$regex : /^?0$/ , \$options : 'i' } }")
    fun findByNickname(nickname: String): Mono<User>

    @Query("{ 'details.email': ?0 }")
    fun findByEmail(email: String): Mono<User>
}
