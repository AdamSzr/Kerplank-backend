package utp.agile.kerplank.model

import java.io.File

data class DirectoryItem(val isDirectory: Boolean, val isFile: Boolean, val path: String, val name: String) {
    companion object {
        fun fromFile(file: File): DirectoryItem {
           return DirectoryItem(file.isDirectory, file.isFile, file.path, file.name)
        }
    }
}
