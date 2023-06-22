package utp.agile.kerplank.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import utp.agile.kerplank.response.BaseResponse
import java.time.Instant

@Document
data class ChatPost(
    @Id val id: String = ObjectId().toHexString(),
    val authorName: String,
    val addresseeName:String?,
    val created: Instant,
    val content: String,
    val chatName: String?,
)

data class ChatPostRequest(val authorName: String, val chatName: String?, val content: String, val addresseeName: String?) {
    fun createChatPost(): ChatPost {
        return ChatPost(authorName = authorName, created = Instant.now(), content = this.content, addresseeName = addresseeName , chatName = chatName )
    }
}

data class ChatPostResponse(val post: ChatPost) : BaseResponse()

data class ChatPostListResponse(val posts: List<ChatPost>) : BaseResponse()
