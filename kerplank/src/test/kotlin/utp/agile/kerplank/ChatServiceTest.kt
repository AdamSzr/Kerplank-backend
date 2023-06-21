package utp.agile.kerplank

import com.mongodb.assertions.Assertions.assertFalse
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import reactor.test.StepVerifier
import utp.agile.kerplank.model.ChatPost
import utp.agile.kerplank.model.ChatPostRequest
import utp.agile.kerplank.repository.ChatPostRepository
import utp.agile.kerplank.service.ChatService
import utp.agile.kerplank.service.ProjectService
import java.time.Instant
import java.time.temporal.ChronoUnit

@SpringBootTest
class ChatServiceTest {

    @Autowired
    lateinit var chatService: ChatService

    @Autowired
    lateinit var chatPostRepository: ChatPostRepository

    @Test
    fun should_Create_ChatPost_Successfully() {
        val chatPostRequest = ChatPostRequest("user1", "Test content")

        val createdChatPostMono = chatService.createChatPost(chatPostRequest)

        StepVerifier.create(createdChatPostMono)
            .expectNextMatches { createdChatPost ->
                createdChatPost.author == chatPostRequest.author &&
                createdChatPost.content == chatPostRequest.content
            }
            .expectComplete()
            .verify()
    }

    @Test
    fun should_Return_Latest_ChatPosts() {
        var chatPost1 = ChatPost(author = "user1", created = Instant.now().plusSeconds(1).truncatedTo(ChronoUnit.MILLIS), content = "Content 1")
        var chatPost2 = ChatPost(author = "user2", created = Instant.now().plusSeconds(2).truncatedTo(ChronoUnit.MILLIS), content = "Content 2")
        var chatPost3 = ChatPost(author = "user3", created = Instant.now().plusSeconds(3).truncatedTo(ChronoUnit.MILLIS), content = "Content 3")

        val savedPost1 = chatPostRepository.save(chatPost1).block()
        val savedPost2 = chatPostRepository.save(chatPost2).block()
        val savedPost3 = chatPostRepository.save(chatPost3).block()

        val latestChatPostsFlux = chatService.latestChatPosts().take(3)

        StepVerifier.create(latestChatPostsFlux)
            .expectNext(chatPost3, chatPost2, chatPost1)
            .expectComplete()
            .verify()

        chatService.deleteChatPost(savedPost1?.id ?: "").block()
        chatService.deleteChatPost(savedPost2?.id ?: "").block()
        chatService.deleteChatPost(savedPost3?.id ?: "").block()
    }

    @Test
    fun should_Delete_Chat_Post_Successfully() {
        val chatPost = ChatPost(author = "user1", created = Instant.now(), content = "Content 1")

        val savedPost= chatPostRepository.save(chatPost).block()

        val resultMono = chatService.deleteChatPost(savedPost?.id ?: "")

        StepVerifier.create(resultMono)
            .expectNext(true)
            .expectComplete()
            .verify()

        val postExists = chatPostRepository.existsById(savedPost?.id ?: "").block()
        assertFalse(postExists ?: true)
    }

}