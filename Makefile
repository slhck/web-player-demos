TAG=`git rev-parse HEAD`

docker_build:
	docker build -t jwplayer/web-player-demos:staging .

docker_push: docker_build
	docker push jwplayer/web-player-demos:staging

boxer_update_deploy:
	boxer update deployment prd.web-player-demos.prd -f .deploy/deployment.yaml

boxer_update_stg-deploy:
	boxer update deployment stg.web-player-demos.stg -f .deploy/stg-deploy.yaml

boxer_get_deploy:
	boxer get deployment app.web-player-demos.prd

boxer_get_ingress:
	boxer get ingress home.web-player-demos.prd

boxer_update_project:
	boxer update project web-player-demos -f .deploy/project.yaml
