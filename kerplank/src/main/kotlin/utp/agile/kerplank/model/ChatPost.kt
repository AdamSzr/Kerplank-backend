package utp.agile.kerplank.model

import org.springframework.core.annotation.Order
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import utp.agile.kerplank.response.BaseResponse
import java.time.Instant

@Document
data class ChatPost(
    @Id val id: String? = null,
    val author: String,
    val created: Instant,
    val content: String
)

data class ChatPostRequest(val author: String, val content: String) {
    fun createChatPost(): ChatPost {
        return ChatPost(id = null, this.author, Instant.now(), this.content)
    }
}

data class ChatPostResponse(val post: ChatPost) :BaseResponse()

data class ChatPostListResponse(val posts:List<ChatPost>):BaseResponse()
