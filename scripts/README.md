## Docker Image Scripts

A set of scripts which make your package.json the source of truth for Docker image tags. To use, make these scripts executable by `cd`ing into this directory and running
```
chmod u+x build-image.sh
chmod u+x publish-image.sh
chmod u+x start-image.sh
chmod u+x yield-image.sh
```

#### yield-image.sh
Extracts your project's name and version from package.json and outputs a string formatted as `"$PROJECT_NAME:$PROJECT_VERSION"`, where `PROJECT_NAME` is evaluated as package.json's name without any scopes attached. For example, if your package.json looked like this
###### package.json
```json
{
  "name": "@myscope/project-name",
  "version": "1.2.3",
  "scripts": {
    "yield:image": "SCRIPTS=\"$(cd $PWD && cd .. && echo \"$PWD/scripts\")\" && $SCRIPTS/yield-image.sh"
  }
}
```
then running `yarn yield:image` would output `project-name:1.2.3`. You probably won't need to ever run yield-image directly as it's called by the following two scripts for you.

#### build-image.sh
Collects the evaluated name:tag yielded from running `yield-image` in your project, and then runs `docker build` in your project's directory, adding the image name:tag to the built image.

Add this script to your package.json like so

###### package.json
```json
{
  "name": "@myscope/project-name",
  "version": "1.2.3",
  "scripts": {
    "build:image": "SCRIPTS=\"$(cd $PWD && cd .. && echo \"$PWD/scripts\")\" && $SCRIPTS/build-image.sh"
  }
}
```

#### publish-image.sh
Publishes the image with name:tag equivalent to that yielded from running `yield-image` on your project to a specified image repository. You should specify the image repository in the `REPOSITORY` environment variable in a file named `.env` in this directory. Basically, cd into this directory and run `echo "REPOSITORY=<your-image-repository>" >> .env`.

Add this script to your package.json like so

###### package.json
```json
{
  "name": "@myscope/project-name",
  "version": "1.2.3",
  "scripts": {
    "publish:image": "SCRIPTS=\"$(cd $PWD && cd .. && echo \"$PWD/scripts\")\" && $SCRIPTS/publish-image.sh"
  }
}
```
