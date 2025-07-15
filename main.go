package main

import (
	"fmt"
	"log"
)

func errorHandlerFatal(err error, errorMsg string) {
	if err != nil {
		log.Printf(errorMsg, err.Error())
	}
}

func main() {
	errorHandlerFatal(nil, "An error occurred: %s")
	fmt.Println("Hello, World!")
}
