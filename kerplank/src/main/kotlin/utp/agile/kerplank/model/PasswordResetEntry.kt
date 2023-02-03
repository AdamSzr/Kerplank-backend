package utp.agile.kerplank.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document


@Document
data class PasswordResetEntry(
    @Id
    val id: String = ObjectId().toHexString(),
    val email: String,
    val uuid: String
)

data class PasswordResetRequest(
    val password: String,
    val uuid: String
)
