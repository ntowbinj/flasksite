#!/bin/bash

IMGS='film0 film1 film2'

for IMG in $IMGS
do
    convert $IMG.jpg -resize 600 $IMG.jpg
done
