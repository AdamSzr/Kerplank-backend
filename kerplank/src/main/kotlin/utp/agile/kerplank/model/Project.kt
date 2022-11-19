package utp.agile.kerplank.model

import org.springframework.data.annotation.Id
import utp.agile.kerplank.model.enumerate.Status
import java.util.*

data class Project(
    @Id val id:String,
    val title:String,
    val description:String,
    val dateTimeCreation:Date,
    val dateTimeDelivery:Date,
    val dateTImeUpdate:Date,
    val status:Status,
    val grade:Int,
    val usersId:List<String>
    )
