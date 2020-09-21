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

# Install dependencies
run npm install;

run npm run babel; # Babel
run npm run minify; # Minify

# Rm unneeded files
del 'LICENCE';
del 'templatecmd.js';
del 'templatemodule.js';
del 'config-example.json';
del 'build.sh';
del 'header.js';

# Exit and echo out
echo "Build complete."
SHASUM=$(find . -type f \( -exec sha1sum "$PWD"/{} \; \) | sha1sum)
echo Build shasum: $SHASUM
exit 0;