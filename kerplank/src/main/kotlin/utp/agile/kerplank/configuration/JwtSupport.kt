package utp.agile.kerplank.configuration

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Component
class JwtSupport {
//
//  private val key = Keys.hmacShaKeyFor("tNO+KhVrTj3B4q0+SEwz/NSvZq7y577jOjvY4uPgAR4=".toByteArray())
//  private val parser = Jwts.parserBuilder().setSigningKey(key).build()
//
  fun generate(username: String): BearerToken {
    return BearerToken("a")
//    val builder = Jwts.builder()
//      .setSubject(username)
//      .setIssuedAt(Date.from(Instant.now()))
//      .setExpiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
//      .signWith(key)
//
//    return BearerToken(builder.compact())
  }
//
  fun getUsername(token: BearerToken): String {
    return "adam"
//    return parser.parseClaimsJws(token.value).body.subject
  }
//
  fun isValid(token: BearerToken, user: UserDetails?): Boolean {
  return true
//    val claims = parser.parseClaimsJws(token.value).body
//    val unexpired = claims.expiration.after(Date.from(Instant.now()))
//
//    return unexpired && (claims.subject == user?.username)
  }

}
