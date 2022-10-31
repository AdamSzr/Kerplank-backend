package utp.agile.kerplank.domain.email

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.stereotype.Service
import java.util.*
import javax.mail.Message


@Service
class EmailService() {

    fun sendEmail(from: String, to: String, subject: String, content: String): String {
        val sender = this.getJavaMailSender()
        val message = sender?.createMimeMessage()
        message?.setText(content)
        message?.setFrom(from)
        message?.setRecipients(Message.RecipientType.TO, to)
        message?.subject = subject

        return try {
            sender?.send(message)
            "Email was sent"
        } catch (e: Exception) {
            e.toString()
        }
    }

    fun getJavaMailSender(): JavaMailSender? {
        val sender = JavaMailSenderImpl()
        sender.protocol = "smtp"
        sender.host = "smtp.gmail.com"
        sender.port = 587
        sender.username = "kerplank.project@gmail.com"
        sender.password = "ljlqwglxbhuespvc"
        val mailProps = Properties()
        mailProps["mail.smtps.auth"] = "true"
        mailProps["mail.smtp.starttls.enable"] = "true"
        mailProps["mail.smtp.debug"] = "true"
        sender.javaMailProperties = mailProps
        return sender
    }
}