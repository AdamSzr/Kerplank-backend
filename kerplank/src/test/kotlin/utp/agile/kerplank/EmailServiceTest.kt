package utp.agile.kerplank

import com.mongodb.assertions.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import utp.agile.kerplank.configuration.EmailAccountConfiguration
import utp.agile.kerplank.service.EmailService

@SpringBootTest
class EmailServiceTest {

    @Test
    fun should_Send_Email_Successfully() {
        val emailAccountConfiguration = EmailAccountConfiguration()
        emailAccountConfiguration.userName = "kerplank.project@gmail.com"
        emailAccountConfiguration.password = "ljlqwglxbhuespvc"

        val emailService = EmailService(emailAccountConfiguration)

        val to = "czarnas123@gmail.com"
        val subject = "Test Email"
        val text = "This is a test email."

        val result = emailService.sendEmail(to, subject, text)

        assertTrue(result)
    }
}