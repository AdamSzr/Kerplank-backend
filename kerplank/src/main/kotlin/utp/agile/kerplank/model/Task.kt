package utp.agile.kerplank.model

import org.springframework.data.annotation.Id
import utp.agile.kerplank.model.enumerate.Status
import java.util.Date
import javax.validation.constraints.Size

data class Task(
    @Id val id:String,
    @Size(max = 100) val title:String,
    @Size(max = 2000) val description:String,
    val userId:String,
    val projectId:String,
    val dateTimeCreation:Date,
    val dateTimeDelivery:Date,
    val status:Status,
    val grade:Int
    )
