package utp.agile.kerplank.domain.drive

import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.domain.utils.structures.SubDirectoriesCreationResult
import org.springframework.stereotype.Service
import java.io.File
import java.lang.Exception
import javax.annotation.PostConstruct

@Service
class DriveService(private val driveConfiguration: DriveConfiguration) {

    var driveDirectory = File(driveConfiguration.directory)

    @PostConstruct
    fun initDrive() {
        driveDirectory.mkdirs()
        File(driveDirectory.absolutePath.plus("/notes")).mkdirs()
    }

    fun createSubDirectory(directory: String): File {
        if (directory.startsWith("/")) {
            driveDirectory.absolutePath.plus(directory)
                .let {
                    File(it)
                }.let {
                    when (it.mkdirs()) {
                        true -> return it
                        else -> throw Exception("Failed during directory creating")
                    }
                }
        } else
            throw Exception("directory to path should start with '/'")
    }

    fun createSubDirectories(directoryList: List<String>): List<SubDirectoriesCreationResult> {
        return directoryList.map {
            kotlin.runCatching { createSubDirectory(it) }
        }.map {
            SubDirectoriesCreationResult(it, it.exceptionOrNull()?.message)
        }
    }

    fun readTextFile(path: String) =
        kotlin.runCatching {
            File((driveDirectory.absolutePath).plus(path)).readText()
        }.let {
            FileReadResult<String>(path, it, it.exceptionOrNull()?.message)
        }


    fun readFile(path: String) =
        kotlin.runCatching {
            File((driveDirectory.absolutePath).plus(path)).readBytes()
        }.let {
            FileReadResult<ByteArray>(path, it, it.exceptionOrNull()?.message)
        }

    fun saveFile(pathWithExtension: String, data: ByteArray) =
        kotlin.runCatching {
            File((driveDirectory.absolutePath).plus(pathWithExtension)).writeBytes(data)
        }.let {
            FileReadResult<Unit>(
                pathWithExtension, it, it.exceptionOrNull()?.message
            )
        }

    fun listDirectoryItems(path: String): List<DirectoryItem>? {
        return File((driveDirectory.absolutePath).plus(path)).let {
            if (!it.isDirectory)
                return null
            else
                it.listFiles()
                    ?.map { file ->
                        DirectoryItem(file.isDirectory, file.isFile, file.path.replace(driveDirectory.absolutePath, ""))
                    }
        }
    }

    data class DirectoryItem(val isDirectory: Boolean, val isFile: Boolean, val path: String)

    data class FileReadResult<T>(val path: String, val result: Result<T>, val errorMessage: String?)

}
