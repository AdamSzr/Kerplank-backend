package utp.agile.kerplank.service

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.stereotype.Service
import utp.agile.kerplank.configuration.EmailAccountConfiguration
import java.util.*
import javax.mail.Message


@Service
class EmailService(private val emailConfiguration: EmailAccountConfiguration) {
    private final val sender = JavaMailSenderImpl()

    init {
        sender.protocol = "smtp"
        sender.host = "smtp.gmail.com"
        sender.port = 587
        sender.username = emailConfiguration.userName
        sender.password = emailConfiguration.password
        val mailProps = Properties()
        mailProps["mail.smtps.auth"] = "true"
        mailProps["mail.smtp.starttls.enable"] = "true"
        mailProps["mail.smtp.debug"] = "true"
        sender.javaMailProperties = mailProps
    }

    fun sendEmail(to: String, subject: String, content: String): Boolean {
        val message = sender.createMimeMessage()
        message.setText(content)
        message.setRecipients(Message.RecipientType.TO, to)
        message.subject = subject

        return runCatching { sender.send(message) }
            .let {
                println("EMAIL - ${it.isSuccess}");
                it.isSuccess
            }
    }
}
