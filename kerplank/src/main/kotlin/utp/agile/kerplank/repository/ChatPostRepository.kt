package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.data.mongodb.repository.Tailable
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import utp.agile.kerplank.model.ChatPost


@Repository
interface ChatPostRepository : ReactiveMongoRepository<ChatPost, String>{
    @Tailable
    fun findAllByChatName(chatName: String): Flux<ChatPost>
    @Tailable
    fun findAllByAddresseeName(authorName: String): Flux<ChatPost>
    @Tailable
//    @Query("{ '$or': [ {'authorName': {'$eq': ?0 }, {'addresseeName': {'$eq': ?0 } }  ]  }") //" {$or:[ {authorName:{$eq:?0}}, {addresseeName:{$eq:?0}} ]}"
    fun findAllByAuthorNameOrAddresseeName(authorName: String, addresseName:String): Flux<ChatPost>

}
