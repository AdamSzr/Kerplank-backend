package utp.agile.kerplank.model

data class UserLoginRequest(
    val type: LoginType,
    val email: String? = null,
    val nickname: String? = null,
    val password: String,
)

enum class LoginType { EMAIL, NICKNAME }

data class UserLoginResponse(val token: String) : BaseResponse()

data class UserSignUpRequest(
    val nickname: String,
    val email: String,
    val password: String,
)

data class UsersListResponse(val list: Collection<User>): BaseResponse()

data class UserChangeActivated(val user: User): BaseResponse()

data class UserSignupResponse(val user: User): BaseResponse()
