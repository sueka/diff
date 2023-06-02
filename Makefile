.DEFAULT_GOAL := build

.PHONY : build check

build :

check :
	@echo >&2 "No test specified"
	@exit 1
