package utp.agile.kerplank.domain.utils

import java.io.File

fun File.writeToTextFile(fileNameWithExt: String, text: String, innerDirectory: String = "/notes"): File {
    if (innerDirectory.startsWith("/").not())
        throw Exception("inner directory should start with /")

    val file = File(this.absolutePath + "${innerDirectory}/${fileNameWithExt}")
    if (!(file.parentFile.exists() && file.parentFile.isDirectory))
        throw Exception("Parrent directory not exists or is not a directory")

    file.writeText(text)
    return file
}
