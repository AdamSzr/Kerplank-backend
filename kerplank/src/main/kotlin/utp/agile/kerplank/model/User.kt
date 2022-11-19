package utp.agile.kerplank.model

import org.springframework.data.annotation.Id
import utp.agile.kerplank.model.enumerate.Role
import javax.validation.constraints.Email
import javax.validation.constraints.Size

data class User(
    @Id val id:String,
    @Email val email:String,
    val role: Role,
    val token:String,
    @Size(max = 45) val name:String,
    @Size(max = 50) val surname:String,
    @Size(min = 100000, max = 999999) val index:Int,
    val password:String
    )
