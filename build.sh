#!/bin/bash

# Build dir
BUILD_DIR="./build/";

run() { # Executer
    echo "> $@" && echo "$($@)";
}
bcd() { # Patched CD
    run cd $@;
    cd $@;
}
del() {
    run rm $@;
}

clear;
if [ -d "$BUILD_DIR" ]; then # Delete old build
    run rm -r $BUILD_DIR
fi;
run mkdir $BUILD_DIR; # Make build dir
bcd $BUILD_DIR; # CD there
run pwd; # Log PWD
bcd ..; # CD back
run rsync -aP --exclude 'node_modules/' ./* $BUILD_DIR; # Copy files
bcd $BUILD_DIR; # CD in
run rm -r $BUILD_DIR; # Remove dupe dir
run npm run babel; # Babel
run rsync -aP ./babel/* .; # Move stuff in
run rm -r ./babel/; # Rm temp dir
run npm run minify; # Minify
run rsync -aP ./minify/* .; # Move stuff in
run rm -r ./minify/; # Rm temp dir

# Rm unneeded files
del 'LICENCE';
del 'templatecmd.js';
del 'templatemodule.js';
del 'config-example.json';
del 'build.sh';
del 'header.js';

# Install dependencies
run npm install;

# Exit and echo out
echo "Build complete."
echo "Build SHA1: $(find . -type f \( -exec sha1sum "$PWD"/{} \; \) | sha1sum)"
exit 0;