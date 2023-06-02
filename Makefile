NPX := npx

src := $(wildcard src/**/*.ts)

.DEFAULT_GOAL := build

.PHONY : build check

build : dist
dist : tsconfig.json $(src)
	$(NPX) tsc --project $<

check :
	@echo >&2 "No test specified"
	@exit 1
