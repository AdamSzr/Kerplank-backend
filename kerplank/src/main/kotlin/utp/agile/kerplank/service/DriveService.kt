package utp.agile.kerplank.service

import org.springframework.stereotype.Service
import utp.agile.kerplank.configuration.DriveConfiguration
import utp.agile.kerplank.model.DirectoryItem
import utp.agile.kerplank.model.FileReadResult
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

    fun createFile(fileNameWitExt: String, destination: String? = null): File {
        val f: File = if (destination != null)
            File("${driveConfiguration.directory}/${destination}/${fileNameWitExt}")
        else
            File("${driveConfiguration.directory}/${fileNameWitExt}")


        println("Requested file-path [${f.path}]")

        if (f.exists() && f.isFile){
            println("file already exists - returning file")
            return f
        }


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

    fun readFile(path: String) =
        kotlin.runCatching {
            var parsedPath =  path//(driveDirectory.absolutePath).plus()
            if(!parsedPath.startsWith('/'))
            parsedPath = "/$path"
            File(driveDirectory.absolutePath.plus(parsedPath)).readBytes()
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
            if (!it.exists())
                return null

            if (!it.isDirectory)
                throw Error("Can not list directory")
            else
                it.listFiles()
                    ?.map { file ->
                        createDirectoryItem(file)
                    }
        }
    }

    fun createDirectoryItem(file: File): DirectoryItem {
        return DirectoryItem(
            file.isDirectory,
            file.isFile,
            file.absolutePath.replace(driveDirectory.absolutePath, ""),
            file.name
        )
    }


}

