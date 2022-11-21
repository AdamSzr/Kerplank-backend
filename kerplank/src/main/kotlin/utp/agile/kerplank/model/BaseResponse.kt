package utp.agile.kerplank.model

import org.intellij.lang.annotations.Pattern

open class BaseResponse(@field:Pattern("ok|fail")
                        val result: String = "ok")


