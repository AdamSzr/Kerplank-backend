package utp.agile.kerplank.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration


@Configuration
class DriveConfiguration {

    @Value("\${data.drive.directory}")
    var directory =""
}
