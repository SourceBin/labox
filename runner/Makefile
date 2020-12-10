RUN=docker run --rm -it --name runner

.PHONY: image
image:
	# build image with all languages
	docker build -t runner .

.PHONY: image-%
image-%:
	# build image with a single language
	docker build -t runner-$(*) --build-arg LANGUAGE=$(*) .

.PHONY: run
run: image
	# run image with all languages
	$(RUN) runner

.PHONY: run-%
run-%: image-%
	# run image with a single language
	$(RUN) runner-$(*)

.PHONY: test
test: image
	# test image with all languages
	$(RUN) runner bash test.sh

.PHONY: test-%
test-%: image-%
	# test image with a single language
	$(RUN) runner-$(*) bash test.sh
