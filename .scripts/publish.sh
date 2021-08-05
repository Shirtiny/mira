#!/bin/sh
###
 # @Author: Shirtiny
 # @Date: 2021-08-05 14:15:59
 # @LastEditTime: 2021-08-05 14:23:16
 # @Description:
###

set -e

error() {
  echo "🚨 $1"
  exit 1
}

assert_ready_to_publish() {
  if [ ! -d dist ]; then
    error "Need build first"
  fi
}

publish() {
  echo "Publish"
  echo "Confirm version"
  yarn publish --access public
  git push --tags
  git push
}

assert_ready_to_publish

publish
