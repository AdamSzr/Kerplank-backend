package utp.agile.kerplank.model


import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

data class AuthenticatedUser(
    val username: String,
    val roles: List<SimpleGrantedAuthority>,
    var auth: Boolean = true
): Authentication {

    override fun getAuthorities(): Collection<GrantedAuthority?> = roles
    override fun getCredentials(): Any = username
    override fun getDetails(): Any? = username
    override fun getPrincipal(): Any = username
    override fun isAuthenticated(): Boolean = auth
    override fun getName(): String = username
    override fun setAuthenticated(authentication: Boolean) {
        auth = authentication
    }
}
