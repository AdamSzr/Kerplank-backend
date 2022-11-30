package utp.agile.kerplank.service

import org.springframework.stereotype.Service
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.model.SubDirectoriesCreationResult
import java.io.File
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

    fun createFile(fileNameWitExt: String): File {
        val f = File("${driveConfiguration.directory}${fileNameWitExt}")

        if (f.exists() && f.isFile)
            return f

        if (!f.exists() && f.parentFile.exists() && f.parentFile.isDirectory) {
            if (f.createNewFile())
                return f
            else
                throw Exception("!f.exists() && f.parentFile.exists() && f.parentFile.isDirectory -> and still cant create file")
        }

        if (!f.exists() && !f.parentFile.exists()) {
            if (File(f.parentFile.path).mkdirs())
                if (f.createNewFile())
                    return f
                else
                    throw Exception("!f.exists() && !f.parentFile.exists() && File(f.parentFile.path).mkdirs() -> but still cant create files")
            else
                throw Exception("!f.exists() && !f.parentFile.exists() -> but still cant create files")
        }

        return f
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
