package utp.agile.kerplank

import org.springframework.security.core.authority.SimpleGrantedAuthority
import java.util.*

fun String.standardizedEmail() = this.lowercase(Locale.getDefault()).trim()


val MODERATOR_ROLE = SimpleGrantedAuthority("MODERATOR")
