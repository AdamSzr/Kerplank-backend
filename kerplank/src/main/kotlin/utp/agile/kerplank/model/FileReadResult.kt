package utp.agile.kerplank.model

data class FileReadResult<T>(val path: String, val result: Result<T>, val errorMessage: String?)
