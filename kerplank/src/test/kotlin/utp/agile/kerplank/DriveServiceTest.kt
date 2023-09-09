package utp.agile.kerplank

import org.junit.jupiter.api.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import utp.agile.kerplank.service.DriveService
import java.nio.charset.Charset


@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DriveServiceTest {

    @Autowired
    lateinit var driveService: DriveService

    val testText = "test"
    val testFilePath = "test-file.txt"
    //Should .... When/Given ...

    @BeforeAll
    fun createTestFile() {
        val file = driveService.createFile(testFilePath)
        val writer = file.writer(Charset.forName("UTF-8"))
        writer.write(testText)
        writer.close()
    }

    @BeforeEach
    fun initializeTest() {
        driveService.initDrive()
    }


    @Test
    fun shouldCreateFileWithGivenFilename() {
        val file = driveService.createFile("test-xd.txt")
        Assertions.assertTrue(file.isFile)
    }

    @Test
    fun shouldCreateFileWithGivenFilenameAndSubdir() {
        val file = driveService.createFile("test-xd.txt", "subdir-test")
        Assertions.assertTrue(file.isFile)
    }

    @Test
    fun shouldCreateFileAndSubDirectories() {
        val file = driveService.createFile("test-xd.txt", "subdir/test/adam/directory")
        Assertions.assertTrue(file.isFile)
    }

    @Test
    fun shouldCreateFileWhenFileNameStartsWithSlash() {
        val file = driveService.createFile("/test-xdd.txt")
        Assertions.assertTrue(file.isFile)
    }

    @Test
    fun shouldCreateFileWhenDestinationStartsWithSlash() {
        val file = driveService.createFile("test-xdd.txt", "/adam-test")
        Assertions.assertTrue(file.isFile)
    }

    @Test
    fun shouldCreateFileWhenFileNameDestinationStartsWithSlash() {
        val file = driveService.createFile("/test-xdd.txt", "/test-dir")
        Assertions.assertTrue(file.isFile)
    }


    @Test
    fun shouldReadFileWhenPathStartsWithoutSlash() {
        val result = driveService.readFile("test-file.txt")
        Assertions.assertTrue(result.result.isSuccess)
    }

    @Test
    fun shouldReadFileWhenPathStartsWithSlash() {
        val result = driveService.readFile("/test-file.txt")
        Assertions.assertTrue(result.result.isSuccess)
    }

    @Test
    fun shouldFileContainsGivenText() {
        val result = driveService.readFile(testFilePath)
        Assertions.assertTrue(result.result.getOrThrow().decodeToString().trim() == testText)
    }

    @Test
    fun shouldNotReadFileWhenFileNotExists() {
        val result = driveService.readFile("random-file-that-not-exist.jpg")
        Assertions.assertFalse(result.result.isSuccess)
    }


    @Test
    fun shouldDeleteFile() {
        val f = driveService.createFile("test-xd.txt")
        Assertions.assertTrue(f.exists() && f.isFile,"File not Exists")
        Assertions.assertTrue(f.delete(), "File can not be deleted")
        Assertions.assertFalse(f.exists(), "File still exists")
    }

}
