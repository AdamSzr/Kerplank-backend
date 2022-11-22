package utp.agile.kerplank.service

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.stereotype.Service
import utp.agile.kerplank.configuration.EmailAccountConfiguration
import java.util.*
import javax.mail.Message


@Service
class EmailService(val emailConfiguration: EmailAccountConfiguration) {

    fun sendEmail(from: String, to: String, subject: String, content: String): Boolean {
        val sender = this.getJavaMailSender()
        val message = sender.createMimeMessage()
        message.setText(content)
        message.setFrom(from)
        message.setRecipients(Message.RecipientType.TO, to)
        message.subject = subject

        return try {
            sender.send(message)
            true
        } catch (e: Exception) {
            println(e.toString())
            false
        }
    }

    fun getJavaMailSender(): JavaMailSender {
        val sender = JavaMailSenderImpl()
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
        return sender
    }
}
