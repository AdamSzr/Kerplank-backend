package utp.agile.kerplank.model

import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document
data class User(
    @Id val nickname: String,
    @JsonIgnore
    var password: String,
    var role: UserRole = UserRole.USER,
    val email: String,
    val details: Map<String, String>,
    @DBRef val permissions: List<Permission> = listOf(),
    val created: Instant = Instant.now(),
    var activated: Boolean = true,
) {
    fun changeRole(newRole: UserRole) =
        this.apply { role = newRole }

    fun changeActivated() =
        this.apply { activated = !activated }
}

enum class UserRole {
    ADMIN, USER, MODERATOR, PARTNER
}

@Document
data class Permission(
    @Id val name: String,
    val description: String?
)

object UserUtils {

    fun singUp(signup: UserSignUpRequest, encryptedPassword: String) =
        User(
            nickname = signup.nickname,
            password = encryptedPassword,
            role = UserRole.USER,
            email = signup.email,
            details = hashMapOf(),
        )

    fun singUpAdmin(signup: UserSignUpRequest, encryptedPassword: String) =
        User(
            nickname = signup.nickname,
            password = encryptedPassword,
            role = UserRole.ADMIN,
            email = signup.email,
            details = hashMapOf(),
        )

    fun changeRole(user: User, newRole: UserRole) =
        user.apply { role = newRole }
}
