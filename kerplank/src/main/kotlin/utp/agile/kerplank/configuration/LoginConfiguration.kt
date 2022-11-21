package utp.agile.kerplank.configuration

import org.springframework.context.ApplicationContext
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import utp.agile.kerplank.auth.TokenProvider
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserLoginRequest

object LoginConfiguration {
    fun getAuthToken(user: User, login: UserLoginRequest, ctx: ApplicationContext): String? {
        val passwordEncoder = ctx.getBean("passwordEncoder", BCryptPasswordEncoder::class.java)
        return if (passwordEncoder.matches(login.password, user.password)) TokenProvider.generateToken(user) else null
    }
}

