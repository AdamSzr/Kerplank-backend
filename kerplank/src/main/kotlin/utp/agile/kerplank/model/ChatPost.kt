package utp.agile.kerplank.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import utp.agile.kerplank.response.BaseResponse
import java.time.Instant

@Document
data class ChatPost(
    @Id val id: String = ObjectId().toHexString(),
    val authorId: String,
    val addresseeId:String?,
    val created: Instant,
    val content: String,
    val chatId: String?,
)

data class ChatPostRequest(val authorId: String, val chatId: String?, val content: String, val addresseeId: String?) {
    fun createChatPost(): ChatPost {
        return ChatPost(authorId = authorId, created = Instant.now(), content = this.content, addresseeId = addresseeId, chatId = chatId )
    }
}

data class ChatPostResponse(val post: ChatPost) : BaseResponse()

data class ChatPostListResponse(val posts: List<ChatPost>) : BaseResponse()
