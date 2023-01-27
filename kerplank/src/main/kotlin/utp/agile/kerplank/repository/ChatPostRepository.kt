package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import utp.agile.kerplank.model.ChatPost


@Repository
interface ChatPostRepository : ReactiveMongoRepository<ChatPost, String>
