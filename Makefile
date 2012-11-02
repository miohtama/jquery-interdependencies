all: docs

prepare-duck:
	gem install jsduck

docs: prepare-duck
	jsduck . --output docs

