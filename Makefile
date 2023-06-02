NPX := npx

src := $(wildcard src/**/*.ts)

.DEFAULT_GOAL := build

.PHONY : build check

build : dist
dist : tsconfig.json $(src)
	$(NPX) tsc --project $<

check : jest.config.mjs $(src)
	$(NPX) jest --config $<
