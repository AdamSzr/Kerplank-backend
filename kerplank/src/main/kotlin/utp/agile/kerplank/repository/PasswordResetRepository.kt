package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.ChatPost
import utp.agile.kerplank.model.PasswordResetEntry


@Repository
interface PasswordResetRepository: ReactiveMongoRepository<PasswordResetEntry, String> {
    fun findByUuid(uuid:String): Mono<PasswordResetEntry>

    fun deleteByUuid(uuid: String):Mono<Void>
}
