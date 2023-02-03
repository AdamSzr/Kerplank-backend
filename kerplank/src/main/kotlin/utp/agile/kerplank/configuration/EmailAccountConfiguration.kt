package utp.agile.kerplank.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.PropertySource
import org.springframework.stereotype.Component

@Configuration
class EmailAccountConfiguration {

    @Value("\${email.account.username}")
    lateinit var userName:String

    @Value("\${email.account.password}")
    lateinit var password:String
}
