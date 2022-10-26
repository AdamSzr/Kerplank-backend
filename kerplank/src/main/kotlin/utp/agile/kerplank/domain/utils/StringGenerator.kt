package utp.agile.kerplank.domain.utils

fun randomString(length: Int) = (1..length)
    .map { kotlin.random.Random.nextInt(48, 57) }
    .map { Char(it) }
    .joinToString("")
