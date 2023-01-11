#!/bin/sh


#########################  SETUP ########################
container_port=8907
image_name=adam-kerplank
version=dev
docker_compose_file_name="docker-compose-adam-kerplank-$version.yml"
#########################################################


kanga_dev_url=http://dev.kanga.team:$container_port/api/ping
registry=registry.kanga.team
local_image_name=$image_name:$version
full_dev_img_name=$registry/$image_name:$version
docker_compose_project=$image_name-$version


echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ---------------- REMOVING-OLD-CONTAIERS ------------------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
docker rmi $full_dev_img_name &&
docker rmi $local_image_name

echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ----------------------- MAVEN-CLEAN --------------------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
./mvnw clean &&
echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ------------------ MAVEN-BUILD-SUCCESS -----------------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
./mvnw package &&
echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ------------ DOCKER-BUILD-IMAGE-TAG [$local_image_name] ----------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
docker build -t $local_image_name . &&
echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ------------ APPLYING-TAG [$full_dev_img_name]----------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
docker tag $local_image_name $full_dev_img_name &&



echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ----------------- PUSHING-IMAGE-TO-REMOTE ----------------------
echo ---------------- ENTER PASSWORD [18******] ----------------------
echo --------------------------------------------------------------
echo  &&
docker push $full_dev_img_name &&

echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ------------------- UPLOADING-TO-REMOTE ------------------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------
scp -P 22 ./$docker_compose_file_name aszreiber@dev.kanga.team:/home/aszreiber &&

echo --------------------------------------------------------------
echo --------------------------------------------------------------
echo ---------------------- SSH-CONNECTION ------------------------
echo --------------------------------------------------------------
echo --------------------------------------------------------------

ssh aszreiber@dev.kanga.team <<- EOF "echo ####################### PULL-IMAGE ####################### &&
docker pull localhost:5000/$image_name:$version &&
echo ####################### DOCKER-COMPOSE ####################### &&
docker-compose -p $image_name -f $docker_compose_file_name up -d &&
exit"
EOF

echo "--------------------------------------------------------------"
echo "--------------------------------------------------------------"
echo "------------------------- DEPLOYED ---------------------------"
echo "--------------------------------------------------------------"
echo "--------------------------------------------------------------"
echo "[IMAGE_NAME   ] = $image_name:$version"
echo "[DOCKER_COMPOSE_FILE] = $docker_compose_file_name"
echo "[DEV_IMG_NAME       ] = $full_dev_img_name"
echo "[SERVICE_URL        ] = $kanga_dev_url"
echo --------------------------------------------------------------
echo --------------------------------------------------------------
