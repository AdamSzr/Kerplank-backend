package utp.agile.kerplank

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import utp.agile.kerplank.service.DriveService


@SpringBootTest
class KerplankDriveServiceTests {

    @Autowired
    lateinit var driveService: DriveService;

    @Test
    fun createFile() {
        val result = driveService.createFile("random.txt")
        assert(result.isFile && result.name.endsWith("random.txt"))
        result.delete()
    }

    @Test
    fun createSubdirectory() {
        val result = driveService.createSubDirectory("/test-dir")
        assert(result.isDirectory)
//        result.delete()
    }

    @Test
    fun createSubDirectories() {
        val result = driveService.createSubDirectories(listOf("/szreiber","/szreiber/test"))
        val r = result.count {  it.isSuccess }
//        result.delete()
    }


}
