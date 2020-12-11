RUN=docker run --rm -it --name runner -p 3000:3000

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
