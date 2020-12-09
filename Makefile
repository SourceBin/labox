RUN=docker run --rm -it --name labox

.PHONY: image
image:
	# build image with all languages
	docker build -t labox .

.PHONY: image-%
image-%:
	# build image with a single language
	docker build -t labox-$(*) --build-arg LANGUAGE=$(*) .

.PHONY: run
run: image
	# run image with all languages
	$(RUN) labox

.PHONY: run-%
run-%: image-%
	# run image with a single language
	$(RUN) labox-$(*)

.PHONY: test
test: image
	# test image with all languages
	$(RUN) labox bash test.sh

.PHONY: test-%
test-%: image-%
	# test image with a single language
	$(RUN) labox-$(*) bash test.sh
