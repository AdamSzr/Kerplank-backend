package utp.agile.kerplank

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KerplankApplication

fun main(args: Array<String>) {
	runApplication<KerplankApplication>(*args)
}
